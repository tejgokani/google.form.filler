import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubmissionResult } from "@shared/schema";

interface ResultCardProps {
  submission: SubmissionResult;
}

export function ResultCard({ submission }: ResultCardProps) {
  const isSuccess = submission.success;
  const timestamp = new Date(submission.timestamp).toLocaleTimeString();

  return (
    <Card
      className={cn(
        "border-l-4 transition-all hover-elevate",
        isSuccess ? "border-l-chart-2" : "border-l-destructive"
      )}
      data-testid={`result-card-${submission.responseNumber}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-chart-2" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-semibold text-foreground">
                  Response #{submission.responseNumber}
                </h4>
                <Badge
                  variant={isSuccess ? "default" : "destructive"}
                  className="text-xs"
                  data-testid={`status-${submission.responseNumber}`}
                >
                  {isSuccess ? "Success" : "Failed"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{timestamp}</span>
              </div>

              {/* Error Message */}
              {!isSuccess && submission.error && (
                <p className="text-xs text-destructive bg-destructive/10 rounded-md p-2 mt-2">
                  {submission.error}
                </p>
              )}

              {/* Preview of Answers */}
              {isSuccess && submission.answers && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Sample Answers:
                  </p>
                  <div className="space-y-1">
                    {Object.entries(submission.answers)
                      .slice(0, 3)
                      .map(([key, value], index) => (
                        <div
                          key={index}
                          className="text-xs text-foreground bg-muted/50 rounded px-2 py-1.5"
                        >
                          <span className="font-medium">{key}:</span>{" "}
                          <span className="text-muted-foreground">
                            {String(value).substring(0, 60)}
                            {String(value).length > 60 ? "..." : ""}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
