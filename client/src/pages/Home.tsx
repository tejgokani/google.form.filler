import { useState } from "react";
import { FormConfigPanel } from "@/components/FormConfigPanel";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Info } from "lucide-react";
import type { FillFormResponse } from "@shared/schema";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<FillFormResponse | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  AI Form Filler
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Automate Google Forms with AI
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Important Disclaimer */}
        <Alert className="mb-8" data-testid="alert-disclaimer">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            This form filler is currently built to respond to <strong>Multiple Choice Question (MCQ)</strong> based forms only. 
            Descriptive questions, checkbox selections, and range-based questions cannot be answered at this time. 
            Development is under progress, and we will be back with a more advanced form filler soon. 
            Thank you for your patience!
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Configuration Panel (Sticky on Desktop) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <FormConfigPanel
                isProcessing={isProcessing}
                onProcessingChange={setIsProcessing}
                onProgressChange={setProgress}
                onResultsChange={setResults}
              />
            </div>
          </div>

          {/* Right Column - Results Panel */}
          <div className="lg:col-span-7">
            <ResultsPanel
              isProcessing={isProcessing}
              progress={progress}
              results={results}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
