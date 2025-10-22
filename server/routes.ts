import type { Express, Response } from "express";
import { createServer, type Server } from "http";
import { parseGoogleForm } from "./services/formAnalyzer";
import { generateFormAnswers } from "./services/answerGenerator";
import { submitFormResponse } from "./services/formSubmitter";
import {
  parseFormRequestSchema,
  fillFormRequestSchema,
  type ParseFormResponse,
  type FillFormResponse,
  type SubmissionResult
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * GET /api/health
   * Health check endpoint for service discovery
   */
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok",
      service: "AI Google Form Filler",
      version: "1.0.0"
    });
  });

  /**
   * POST /api/parse-form
   * Parse a Google Form and extract questions
   */
  app.post("/api/parse-form", async (req, res) => {
    try {
      const validatedData = parseFormRequestSchema.parse(req.body);
      
      const parsedForm = await parseGoogleForm(validatedData.formUrl);
      
      const response: ParseFormResponse = {
        formId: parsedForm.formId,
        title: parsedForm.title,
        questions: parsedForm.questions
      };
      
      res.json(response);
    } catch (error) {
      console.error("Parse form error:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Failed to parse form"
      });
    }
  });

  /**
   * POST /api/fill-form
   * Generate responses and submit to Google Form with SSE progress updates
   */
  app.post("/api/fill-form", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const validatedData = fillFormRequestSchema.parse(req.body);
      
      // Set up SSE headers for real-time progress updates
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const sendProgress = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Send initial parsing status
      sendProgress({ 
        type: 'status', 
        message: 'Parsing form...',
        current: 0,
        total: validatedData.numResponses
      });

      // Parse the form to get questions and submit URL
      const parsedForm = await parseGoogleForm(validatedData.formUrl);
      
      if (parsedForm.questions.length === 0) {
        sendProgress({ type: 'error', error: 'No questions found in the form' });
        res.end();
        return;
      }

      sendProgress({ 
        type: 'status', 
        message: 'Form parsed successfully. Starting submissions...',
        current: 0,
        total: validatedData.numResponses
      });

      const submissions: SubmissionResult[] = [];
      let successCount = 0;
      let failedCount = 0;

      // Generate and submit each response
      for (let i = 0; i < validatedData.numResponses; i++) {
        const responseNumber = i + 1;
        
        sendProgress({
          type: 'progress',
          message: `Generating response ${responseNumber}...`,
          current: i,
          total: validatedData.numResponses
        });

        try {
          // Generate answers for all questions
          const answers = await generateFormAnswers(
            parsedForm.questions,
            validatedData.userData,
            validatedData.useAI
          );

          sendProgress({
            type: 'progress',
            message: `Submitting response ${responseNumber}...`,
            current: i,
            total: validatedData.numResponses
          });

          // Submit the response
          const result = await submitFormResponse(parsedForm.submitUrl, answers);

          if (result.success) {
            successCount++;
            submissions.push({
              success: true,
              responseNumber,
              timestamp: new Date().toISOString(),
              answers
            });

            sendProgress({
              type: 'submission',
              success: true,
              responseNumber,
              current: responseNumber,
              total: validatedData.numResponses
            });
          } else {
            failedCount++;
            submissions.push({
              success: false,
              responseNumber,
              timestamp: new Date().toISOString(),
              error: result.error || "Submission failed"
            });

            sendProgress({
              type: 'submission',
              success: false,
              responseNumber,
              error: result.error,
              current: responseNumber,
              total: validatedData.numResponses
            });
          }
        } catch (error) {
          failedCount++;
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          submissions.push({
            success: false,
            responseNumber,
            timestamp: new Date().toISOString(),
            error: errorMessage
          });

          sendProgress({
            type: 'submission',
            success: false,
            responseNumber,
            error: errorMessage,
            current: responseNumber,
            total: validatedData.numResponses
          });
        }

        // Small delay between submissions
        if (i < validatedData.numResponses - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      const duration = Date.now() - startTime;

      const finalResponse: FillFormResponse = {
        totalRequested: validatedData.numResponses,
        successCount,
        failedCount,
        submissions,
        duration
      };

      // Send final complete message
      sendProgress({
        type: 'complete',
        data: finalResponse
      });

      res.end();
    } catch (error) {
      console.error("Fill form error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fill form";
      
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        error: errorMessage 
      })}\n\n`);
      res.end();
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
