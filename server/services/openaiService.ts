import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

// Using OpenAI integration blueprint
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GenerateAnswerOptions {
  question: string;
  questionType: string;
  maxLength?: number;
}

/**
 * Generate a contextual answer using OpenAI's GPT-5 model
 */
export async function generateAnswer(options: GenerateAnswerOptions): Promise<string> {
  const { question, questionType, maxLength = 200 } = options;

  try {
    const prompt = createPrompt(question, questionType, maxLength);

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are helping to fill out a survey form. Generate realistic, natural-sounding answers that would be typical responses from a real person. Keep answers concise and relevant to the question asked."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: maxLength > 100 ? 500 : 150,
    });

    const answer = response.choices[0]?.message?.content?.trim() || "";
    
    // Ensure answer doesn't exceed max length
    if (answer.length > maxLength) {
      return answer.substring(0, maxLength - 3) + "...";
    }

    return answer;
  } catch (error) {
    console.error("OpenAI error:", error);
    // Fallback to a generic answer if OpenAI fails
    return generateFallbackAnswer(questionType);
  }
}

/**
 * Create an appropriate prompt based on question type
 */
function createPrompt(question: string, questionType: string, maxLength: number): string {
  if (questionType === "PARAGRAPH") {
    return `Answer this survey question with 2-4 sentences (max ${maxLength} characters): "${question}"`;
  } else if (questionType === "SHORT_TEXT") {
    return `Answer this survey question briefly in 1-2 sentences (max ${maxLength} characters): "${question}"`;
  } else {
    return `Provide a brief, natural answer to this question (max ${maxLength} characters): "${question}"`;
  }
}

/**
 * Generate fallback answers when OpenAI is unavailable
 */
function generateFallbackAnswer(questionType: string): string {
  const fallbacks = {
    SHORT_TEXT: "This is a sample response",
    PARAGRAPH: "This is a sample paragraph response. It provides a bit more detail than a short answer would. The content is generic but demonstrates the expected format.",
    EMAIL: "example@email.com",
  };

  return fallbacks[questionType as keyof typeof fallbacks] || "Response provided";
}

/**
 * Batch generate multiple answers for efficiency
 */
export async function generateMultipleAnswers(
  questions: Array<{ question: string; questionType: string; maxLength?: number }>
): Promise<string[]> {
  // For now, generate sequentially. Could be optimized with Promise.all
  const answers: string[] = [];
  
  for (const q of questions) {
    const answer = await generateAnswer(q);
    answers.push(answer);
  }
  
  return answers;
}
