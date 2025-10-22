import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/EmptyState";
import { StatsCard } from "@/components/StatsCard";
import { ResultCard } from "@/components/ResultCard";
import { CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import type { FillFormResponse } from "@shared/schema";

interface ResultsPanelProps {
  isProcessing: boolean;
  progress: { current: number; total: number };
  results: FillFormResponse | null;
}

export function ResultsPanel({ isProcessing, progress, results }: ResultsPanelProps) {
  // Show empty state when not processing and no results
  if (!isProcessing && !results) {
    return <EmptyState />;
  }

  // Show progress during processing
  if (isProcessing) {
    const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

    return (
      <Card data-testid="card-processing">
        <CardHeader>
          <CardTitle data-testid="title-processing">Processing Responses</CardTitle>
          <CardDescription>
            Generating AI-powered responses and submitting to Google Forms...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Response {progress.current} of {progress.total}
              </span>
              <span className="font-medium text-foreground">
                {Math.round(percentage)}%
              </span>
            </div>
            <Progress value={percentage} className="h-2" data-testid="progress-bar" />
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Clock className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">
                Analyzing questions and generating contextual answers...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show results
  if (results) {
    const successRate = results.totalRequested > 0
      ? (results.successCount / results.totalRequested) * 100
      : 0;

    return (
      <div className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon={CheckCircle2}
            label="Successful"
            value={results.successCount}
            variant="success"
            testId="stat-success"
          />
          <StatsCard
            icon={XCircle}
            label="Failed"
            value={results.failedCount}
            variant="error"
            testId="stat-failed"
          />
          <StatsCard
            icon={Clock}
            label="Duration"
            value={`${(results.duration / 1000).toFixed(1)}s`}
            variant="neutral"
            testId="stat-duration"
          />
          <StatsCard
            icon={TrendingUp}
            label="Success Rate"
            value={`${Math.round(successRate)}%`}
            variant="neutral"
            testId="stat-success-rate"
          />
        </div>

        {/* Individual Results */}
        <Card data-testid="card-results">
          <CardHeader>
            <CardTitle data-testid="title-results">Submission Details</CardTitle>
            <CardDescription>
              Individual response submissions and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.submissions.map((submission, index) => (
                <ResultCard key={index} submission={submission} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
