import { QuestionType, type FormQuestion, type UserData } from "@shared/schema";
import { generateAnswer } from "./openaiService";
import { randomInt, randomChoice, randomChoices, randomDate, randomTime, randomEmail } from "../utils/randomizer";

/**
 * Generate an appropriate answer for a given question
 */
export async function generateAnswerForQuestion(
  question: FormQuestion,
  userData?: UserData,
  useAI: boolean = true
): Promise<string | string[]> {
  // Handle email questions with provided user data
  if (question.type === QuestionType.EMAIL || question.label.toLowerCase().includes('email')) {
    if (userData?.email) {
      return userData.email;
    }
    return randomEmail();
  }

  // Handle name questions with provided user data
  if (question.label.toLowerCase().includes('name') && userData?.name) {
    return userData.name;
  }

  switch (question.type) {
    case QuestionType.SHORT_TEXT:
      if (useAI) {
        return await generateAnswer({
          question: question.label,
          questionType: "SHORT_TEXT",
          maxLength: 150
        });
      }
      return generateDefaultShortText(question.label);

    case QuestionType.PARAGRAPH:
      if (useAI) {
        return await generateAnswer({
          question: question.label,
          questionType: "PARAGRAPH",
          maxLength: 500
        });
      }
      return generateDefaultParagraph(question.label);

    case QuestionType.MULTIPLE_CHOICE:
      if (question.options && question.options.length > 0) {
        return randomChoice(question.options) || question.options[0];
      }
      return "Option 1";

    case QuestionType.CHECKBOXES:
      if (question.options && question.options.length > 0) {
        const selected = randomChoices(question.options, 1, Math.min(3, question.options.length));
        return selected;
      }
      return ["Option 1"];

    case QuestionType.DROPDOWN:
      if (question.options && question.options.length > 0) {
        return randomChoice(question.options) || question.options[0];
      }
      return "Option 1";

    case QuestionType.LINEAR_SCALE:
      const min = question.scaleMin || 1;
      const max = question.scaleMax || 5;
      return String(randomInt(min, max));

    case QuestionType.DATE:
      return randomDate();

    case QuestionType.TIME:
      return randomTime();

    default:
      return "Response provided";
  }
}

/**
 * Generate default short text when AI is disabled
 */
function generateDefaultShortText(question: string): string {
  const templates = [
    "This is a sample response",
    "Response provided",
    "Sample answer",
    "Test response"
  ];
  return randomChoice(templates) || templates[0];
}

/**
 * Generate default paragraph text when AI is disabled
 */
function generateDefaultParagraph(question: string): string {
  return "This is a sample paragraph response. It provides more detail than a short answer. The content is generated automatically for testing purposes and demonstrates the expected format for this type of question.";
}

/**
 * Generate answers for all questions in a form
 */
export async function generateFormAnswers(
  questions: FormQuestion[],
  userData?: UserData,
  useAI: boolean = true
): Promise<Record<string, any>> {
  const answers: Record<string, any> = {};

  console.log(`[AnswerGenerator] Generating answers for ${questions.length} questions (useAI: ${useAI})`);

  for (const question of questions) {
    try {
      const answer = await generateAnswerForQuestion(question, userData, useAI);
      answers[question.name] = answer;
      console.log(`[AnswerGenerator] ${question.name} (${question.type}): "${question.label}" => ${JSON.stringify(answer)}`);
    } catch (error) {
      console.error(`Error generating answer for ${question.name}:`, error);
      // Provide fallback answer
      answers[question.name] = "Response provided";
    }
  }

  console.log(`[AnswerGenerator] Final answers object:`, JSON.stringify(answers, null, 2));
  return answers;
}
