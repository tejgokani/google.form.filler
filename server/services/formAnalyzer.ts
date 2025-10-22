import axios from "axios";
import * as cheerio from "cheerio";
import { QuestionType, type FormQuestion } from "@shared/schema";

interface ParsedForm {
  formId: string;
  title: string;
  questions: FormQuestion[];
  submitUrl: string;
}

/**
 * Parse a Google Form URL and extract all questions and metadata
 */
export async function parseGoogleForm(formUrl: string): Promise<ParsedForm> {
  try {
    // Fetch the form HTML
    const response = await axios.get(formUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract form ID from URL
    const formId = extractFormId(formUrl);

    // Extract form title
    const title = $('div[role="heading"]').first().text().trim() || 
                  $('h1').first().text().trim() || 
                  "Google Form";

    // Parse questions from the HTML
    const questions = extractQuestions($, html);

    console.log(`[FormAnalyzer] Parsed ${questions.length} questions from form "${title}"`);
    console.log(`[FormAnalyzer] Questions:`, JSON.stringify(questions, null, 2));

    // Construct submit URL
    const submitUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    return {
      formId,
      title,
      questions,
      submitUrl
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch form: ${error.message}`);
    }
    throw new Error("Failed to parse Google Form");
  }
}

/**
 * Extract form ID from Google Form URL
 */
function extractFormId(url: string): string {
  const match = url.match(/\/forms\/d\/e\/([^\/]+)/);
  if (match) {
    return match[1];
  }

  const altMatch = url.match(/\/forms\/d\/([^\/]+)/);
  if (altMatch) {
    return altMatch[1];
  }

  throw new Error("Invalid Google Form URL");
}

/**
 * Extract questions from the form HTML
 * Google Forms structure can vary, this handles common patterns
 */
function extractQuestions($: cheerio.CheerioAPI, html: string): FormQuestion[] {
  const questions: FormQuestion[] = [];

  try {
    // Try to extract from JavaScript data
    const scriptMatch = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[.*?\]);/s);
    if (scriptMatch) {
      const data = JSON.parse(scriptMatch[1]);
      return parseQuestionsFromData(data);
    }
  } catch (e) {
    console.log("Could not parse from script data, falling back to HTML parsing");
  }

  // Fallback: Parse from visible HTML structure
  // This is a simplified version - Google Forms structure is complex
  $('[role="listitem"]').each((index, element) => {
    const $elem = $(element);
    
    const label = $elem.find('[role="heading"]').text().trim() || 
                  $elem.find('.freebirdFormviewerComponentsQuestionBaseTitle').text().trim();
    
    if (!label) return;

    // Try to determine question type from HTML structure
    const question: FormQuestion = {
      id: `q${index + 1}`,
      type: QuestionType.SHORT_TEXT,
      label,
      name: `entry.${1000000 + index}`, // Fallback entry name
      required: $elem.text().includes("*") || $elem.find('[aria-required="true"]').length > 0,
    };

    // Detect question type
    if ($elem.find('input[type="radio"]').length > 0) {
      question.type = QuestionType.MULTIPLE_CHOICE;
      question.options = [];
      $elem.find('input[type="radio"]').each((_, radio) => {
        const optionLabel = $(radio).closest('div').find('span').text().trim();
        if (optionLabel && question.options) {
          question.options.push(optionLabel);
        }
      });
    } else if ($elem.find('input[type="checkbox"]').length > 0) {
      question.type = QuestionType.CHECKBOXES;
      question.options = [];
      $elem.find('input[type="checkbox"]').each((_, checkbox) => {
        const optionLabel = $(checkbox).closest('div').find('span').text().trim();
        if (optionLabel && question.options) {
          question.options.push(optionLabel);
        }
      });
    } else if ($elem.find('textarea').length > 0) {
      question.type = QuestionType.PARAGRAPH;
    } else if ($elem.find('select').length > 0) {
      question.type = QuestionType.DROPDOWN;
      question.options = [];
      $elem.find('option').each((_, option) => {
        const optionText = $(option).text().trim();
        if (optionText && question.options) {
          question.options.push(optionText);
        }
      });
    }

    // Extract actual entry name if possible
    const input = $elem.find('input, textarea, select').first();
    const nameAttr = input.attr('name');
    if (nameAttr) {
      question.name = nameAttr;
    }

    questions.push(question);
  });

  return questions;
}

/**
 * Parse questions from Google Forms internal data structure
 */
function parseQuestionsFromData(data: any[]): FormQuestion[] {
  const questions: FormQuestion[] = [];

  try {
    // Google Forms data is deeply nested - this is a simplified parser
    const formData = data[1]?.[1];
    if (!formData) return questions;

    formData.forEach((questionData: any, index: number) => {
      if (!Array.isArray(questionData) || questionData.length < 4) return;

      const questionId = questionData[4]?.[0]?.[0];
      const label = questionData[1];
      const typeCode = questionData[3];
      const required = questionData[4]?.[0]?.[2] === 1;

      if (!label || !questionId) return;

      const question: FormQuestion = {
        id: `q${index + 1}`,
        type: mapGoogleFormType(typeCode),
        label,
        name: `entry.${questionId}`,
        required,
      };

      // Extract options for choice-based questions
      if (questionData[4]?.[0]?.[1]) {
        const optionsData = questionData[4][0][1];
        if (Array.isArray(optionsData)) {
          question.options = optionsData.map((opt: any) => opt[0]).filter(Boolean);
        }
      }

      // Extract scale data
      if (typeCode === 3 && questionData[4]?.[0]?.[3]) {
        question.scaleMin = questionData[4][0][3][0] || 1;
        question.scaleMax = questionData[4][0][3][1] || 5;
      }

      questions.push(question);
    });
  } catch (e) {
    console.error("Error parsing question data:", e);
  }

  return questions;
}

/**
 * Map Google Form internal type codes to our QuestionType enum
 */
function mapGoogleFormType(typeCode: number): QuestionType {
  const typeMap: Record<number, QuestionType> = {
    0: QuestionType.SHORT_TEXT,
    1: QuestionType.PARAGRAPH,
    2: QuestionType.MULTIPLE_CHOICE,
    3: QuestionType.LINEAR_SCALE,
    4: QuestionType.CHECKBOXES,
    5: QuestionType.DROPDOWN,
    7: QuestionType.DROPDOWN,
    9: QuestionType.DATE,
    10: QuestionType.TIME,
  };

  return typeMap[typeCode] || QuestionType.SHORT_TEXT;
}
