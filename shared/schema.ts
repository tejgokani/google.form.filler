import { z } from "zod";

// Question types that can appear in Google Forms
export enum QuestionType {
  SHORT_TEXT = "SHORT_TEXT",
  PARAGRAPH = "PARAGRAPH",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  CHECKBOXES = "CHECKBOXES",
  DROPDOWN = "DROPDOWN",
  LINEAR_SCALE = "LINEAR_SCALE",
  DATE = "DATE",
  TIME = "TIME",
  EMAIL = "EMAIL",
}

// Parsed question from Google Form
export const formQuestionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(QuestionType),
  label: z.string(),
  name: z.string(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  scaleMin: z.number().optional(),
  scaleMax: z.number().optional(),
});

export type FormQuestion = z.infer<typeof formQuestionSchema>;

// Request to parse a Google Form
export const parseFormRequestSchema = z.object({
  formUrl: z.string().url("Please enter a valid URL"),
});

export type ParseFormRequest = z.infer<typeof parseFormRequestSchema>;

// Response from parsing a form
export const parseFormResponseSchema = z.object({
  formId: z.string(),
  title: z.string().optional(),
  questions: z.array(formQuestionSchema),
});

export type ParseFormResponse = z.infer<typeof parseFormResponseSchema>;

// Optional user data for consistent responses
export const userDataSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UserData = z.infer<typeof userDataSchema>;

// Request to fill a form with AI-generated responses
export const fillFormRequestSchema = z.object({
  formUrl: z.string().url("Please enter a valid URL"),
  numResponses: z.number().min(1, "At least 1 response required").max(100, "Maximum 100 responses allowed"),
  userData: userDataSchema.optional(),
  useAI: z.boolean().default(true),
});

export type FillFormRequest = z.infer<typeof fillFormRequestSchema>;

// Individual submission result
export const submissionResultSchema = z.object({
  success: z.boolean(),
  responseNumber: z.number(),
  timestamp: z.string(),
  error: z.string().optional(),
  answers: z.record(z.string(), z.any()).optional(),
});

export type SubmissionResult = z.infer<typeof submissionResultSchema>;

// Response from filling a form
export const fillFormResponseSchema = z.object({
  totalRequested: z.number(),
  successCount: z.number(),
  failedCount: z.number(),
  submissions: z.array(submissionResultSchema),
  duration: z.number(), // in milliseconds
});

export type FillFormResponse = z.infer<typeof fillFormResponseSchema>;

// Progress update during form filling (for streaming/websocket)
export const progressUpdateSchema = z.object({
  current: z.number(),
  total: z.number(),
  status: z.enum(["parsing", "generating", "submitting", "complete", "error"]),
  message: z.string().optional(),
});

export type ProgressUpdate = z.infer<typeof progressUpdateSchema>;
