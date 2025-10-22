import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, Zap } from "lucide-react";

export function EmptyState() {
  return (
    <Card data-testid="card-empty-state">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6" data-testid="content-empty-state">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-16 h-16 text-primary/50" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-chart-2 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3 max-w-md">
          <h3 className="text-xl font-semibold text-foreground">
            Ready to automate your Google Forms
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enter a Google Form URL, configure your settings, and let AI generate
            intelligent, contextual responses automatically. Perfect for testing,
            demonstrations, or bulk submissions.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <div className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            AI-Powered Answers
          </div>
          <div className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            Multiple Responses
          </div>
          <div className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            Real-time Progress
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
