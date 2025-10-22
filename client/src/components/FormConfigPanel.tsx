import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Play } from "lucide-react";
import { NumberStepper } from "@/components/NumberStepper";
import { useToast } from "@/hooks/use-toast";
import { fillFormRequestSchema, type FillFormRequest, type FillFormResponse } from "@shared/schema";

interface FormConfigPanelProps {
  isProcessing: boolean;
  onProcessingChange: (processing: boolean) => void;
  onProgressChange: (progress: { current: number; total: number }) => void;
  onResultsChange: (results: FillFormResponse | null) => void;
}

export function FormConfigPanel({
  isProcessing,
  onProcessingChange,
  onProgressChange,
  onResultsChange,
}: FormConfigPanelProps) {
  const { toast } = useToast();
  const [numResponses, setNumResponses] = useState(1);

  const form = useForm<FillFormRequest>({
    resolver: zodResolver(fillFormRequestSchema),
    defaultValues: {
      formUrl: "",
      numResponses: 1,
      userData: {
        name: "",
        email: "",
      },
      useAI: true,
    },
  });

  const onSubmit = async (data: FillFormRequest) => {
    onProcessingChange(true);
    onResultsChange(null);
    onProgressChange({ current: 0, total: numResponses });

    try {
      const response = await fetch("/api/fill-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, numResponses }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let finalResult: FillFormResponse | null = null;
      let buffer = ""; // Buffer for incomplete chunks

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Append new chunk to buffer
        buffer += decoder.decode(value, { stream: true });

        // Split by double newline (SSE message delimiter)
        const messages = buffer.split("\n\n");
        
        // Keep the last incomplete message in buffer
        buffer = messages.pop() || "";

        // Process complete messages
        for (const message of messages) {
          if (message.startsWith("data: ")) {
            try {
              const eventData = JSON.parse(message.slice(6));

              if (eventData.type === "progress" || eventData.type === "submission") {
                onProgressChange({
                  current: eventData.current || 0,
                  total: eventData.total || numResponses,
                });
              } else if (eventData.type === "complete") {
                finalResult = eventData.data;
              } else if (eventData.type === "error") {
                throw new Error(eventData.error);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim() && buffer.startsWith("data: ")) {
        try {
          const eventData = JSON.parse(buffer.slice(6));
          if (eventData.type === "complete") {
            finalResult = eventData.data;
          }
        } catch (e) {
          console.error("Error parsing final SSE data:", e);
        }
      }

      if (finalResult) {
        onResultsChange(finalResult);
        toast({
          title: "Form filling complete!",
          description: `Successfully submitted ${finalResult.successCount} out of ${finalResult.totalRequested} responses.`,
        });
      } else {
        throw new Error("No final results received from server");
      }
    } catch (error: any) {
      toast({
        title: "Error filling form",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      onProcessingChange(false);
      onProgressChange({ current: 0, total: 0 });
    }
  };

  return (
    <Card data-testid="card-form-config">
      <CardHeader>
        <CardTitle>Configure Form Filling</CardTitle>
        <CardDescription>
          Enter your Google Form URL and customize response settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form URL Input */}
            <FormField
              control={form.control}
              name="formUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Form URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://docs.google.com/forms/d/e/..."
                      className="font-mono text-sm"
                      data-testid="input-form-url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste the complete Google Form link
                  </FormDescription>
                  <FormMessage data-testid="error-form-url" />
                </FormItem>
              )}
            />

            {/* Number of Responses */}
            <div className="space-y-3">
              <FormLabel>Number of Responses</FormLabel>
              <NumberStepper
                value={numResponses}
                onChange={setNumResponses}
                min={1}
                max={100}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Generate between 1 and 100 form responses
              </p>
            </div>

            {/* Optional User Data */}
            <Accordion type="single" collapsible data-testid="accordion-user-data">
              <AccordionItem value="user-data" className="border-border">
                <AccordionTrigger className="text-sm font-medium" data-testid="trigger-user-data">
                  Optional: Consistent User Data
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="userData.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            data-testid="input-user-name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Use the same name across all responses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userData.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            data-testid="input-user-email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Use the same email across all responses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isProcessing}
              data-testid="button-fill-form"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Generate & Fill Responses
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
