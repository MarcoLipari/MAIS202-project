import { Brain, Sparkles, Zap, Target, TrendingUp, BarChart3, CheckCircle2, Code2, Server, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGitHubRepoUrl } from "@/lib/config"

const pipelineSteps = [
  { title: "Ingest", detail: "Pushshift torrents → CSV", icon: Brain },
  { title: "Sample", detail: "20K comments / month", icon: Sparkles },
  { title: "Train", detail: "RoBERTa-base fine-tune", icon: Target },
  { title: "Serve", detail: "FastAPI + Next.js", icon: Share2 },
]

export function Methodology() {
  return (
    <section id="methodology" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5">
              <Brain className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-5xl font-bold">How It Was Done</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {pipelineSteps.map(({ title, detail, icon: Icon }) => (
            <div key={title} className="p-4 rounded-2xl bg-secondary/50 border border-border/60 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
                <p className="text-sm font-medium text-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Preprocessing */}
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 hover:border-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/10">
            <div className="absolute top-6 right-6 p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div className="pr-16">
              <h3 className="text-2xl font-bold mb-3">Preprocessing</h3>
              <p className="text-muted-foreground mb-6 text-sm">Data preparation pipeline</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Text cleaning & tokenization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">DistilBERT</strong> & <strong className="text-foreground">RoBERTa</strong> tokenizers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Contextualized embeddings</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-accent hover:text-accent/80" asChild>
                <a href={getGitHubRepoUrl()} target="_blank" rel="noopener noreferrer">
                  <Code2 className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>

          {/* Classification Model */}
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 hover:border-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/10">
            <div className="absolute top-6 right-6 p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div className="pr-16">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-2xl font-bold">2-Bin Classification</h3>
                <span className="text-xs text-muted-foreground font-medium">2008-2010 vs 2020-2022</span>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-baseline gap-2 px-6 py-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                  <span className="text-5xl font-bold text-accent">85.3%</span>
                  <span className="text-sm font-medium text-muted-foreground ml-2">Accuracy</span>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">RoBERTa-base</strong> encoder + classifier head</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Batch size 16 • LR 2e-5 • Warmup 10%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Precision: 87.3%, F1: 85.5%</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-accent hover:text-accent/80" asChild>
                <a href={getGitHubRepoUrl()} target="_blank" rel="noopener noreferrer">
                  <Code2 className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>

          {/* Regression Fallback */}
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 hover:border-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/10">
            <div className="absolute top-6 right-6 p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div className="pr-16">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-2xl font-bold">Regression Fallback</h3>
                <span className="text-xs text-muted-foreground font-medium">2006–2024</span>
              </div>
              <p className="text-muted-foreground mb-6 text-sm">Continuous year prediction if classification weights are missing</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">MAE: 4.4 years</strong> • RMSE: 5.6</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Off-by-2 accuracy: 72%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Uses same RoBERTa backbone with regression head</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-accent hover:text-accent/80" asChild>
                <a href={getGitHubRepoUrl()} target="_blank" rel="noopener noreferrer">
                  <Code2 className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>

          {/* Evaluation Metrics */}
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 hover:border-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/10">
            <div className="absolute top-6 right-6 p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <div className="pr-16">
              <h3 className="text-2xl font-bold mb-3">Evaluation</h3>
              <p className="text-muted-foreground mb-6 text-sm">Classification + regression reporting</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent">Accuracy</span>
                <span className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent">Macro F1</span>
                <span className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent">MAE / RMSE</span>
                <span className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent">Off-by-1 & 2</span>
                <span className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent">Confusion Matrix</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment */}
        <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 hover:border-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/10">
          <div className="absolute top-6 right-6 p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <Server className="h-6 w-6 text-accent" />
          </div>
          <div className="pr-16">
            <h3 className="text-2xl font-bold mb-3">Serving & Demo</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              FastAPI loads the classifier if weights exist and falls back to regression otherwise. The Next.js frontend
              consumes the `/predict` endpoint live.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Environment variables: `MODEL_PATH_CLASSIFICATION`, `MODEL_PATH_REGRESSION`, `NEXT_PUBLIC_API_URL`</p>
              <p>• Graceful fallback logic so the demo never breaks even if weights are missing</p>
              <p>• Response includes predicted bin, midpoint year, confidence, and class probabilities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
