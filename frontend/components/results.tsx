import { Card } from "@/components/ui/card"
import { BarChart3, Sparkles, Target, TrendingUp } from "lucide-react"

const statHighlights = [
  { label: "Accuracy", value: "85.3%", detail: "2-bin (2008-10 vs 2020-22)" },
  { label: "Precision", value: "87.3%", detail: "Balanced classes" },
  { label: "F1 Score", value: "85.5%", detail: "Stable across folds" },
  { label: "Architecture", value: "RoBERTa-base", detail: "HF Transformers" },
]

const experiments = [
  { title: "2-bin classifier", value: "85%", comment: "Chosen for demo" },
  { title: "3-bin classifier", value: "≈60%", comment: "Needs longer training" },
  { title: "4-bin classifier", value: "≈53%", comment: "Sparse data" },
  { title: "Regression", value: "MAE 4.4y", comment: "Always-on fallback" },
]

const insights = [
  "RoBERTa detects cultural drift: finance-heavy jargon and minimal emoji usage indicates 2008–2010, while slang + emoji sprawl signals 2020–2022.",
  "Confidence rarely sits near 50/50. The model usually reports >70% confidence for one era, making the demo feel decisive.",
  "FastAPI falls back to the regression head whenever classifier weights are missing, so `/predict` always responds.",
]

export function Results() {
  return (
    <section id="results" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold text-center">Results</h2>
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto">
          The live experience prioritizes the 2-bin classifier. If those weights are absent, the regression model predicts a
          specific year so the storytelling still lands.
        </p>

        <Card className="p-10 card-hover border-2 border-accent/20 hover:border-accent/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-60" />
          <div className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {statHighlights.map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-background/80 border border-border/70 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="text-4xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">Training setup</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 3 epochs • batch size 16 • learning rate 2e-5</li>
                  <li>• Warmup ratio 10% to prevent catastrophic forgetting</li>
                  <li>• Stratified batches keep both bins balanced each step</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">Time periods</p>
                <p className="text-sm text-muted-foreground">
                  Bin 1 captures early Reddit (financial crisis era, OG meme energy). Bin 2 represents pandemic-era language,
                  slang, and emoji usage. Distinct vocabularies make the task learnable.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Final takeaway: <span className="text-foreground font-semibold">85.3% accuracy</span> with confident predictions
              and interpretable outputs for the fair. Regression (MAE ≈ 4.4 years) is always ready for exact-year analysis or
              fallback scenarios.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-[0.3em]">
              <Sparkles className="h-3.5 w-3.5" />
              Key Insights
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {insights.map((insight) => (
                <li key={insight} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-[0.3em]">
              <Target className="h-3.5 w-3.5" />
              Experiment Log
            </div>
            <div className="space-y-3">
              {experiments.map(({ title, value, comment }) => (
                <div key={title} className="p-4 rounded-2xl bg-background/80 border border-border/60 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{comment}</p>
                  </div>
                  <span className="text-lg font-bold text-accent">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-[0.3em]">
            <TrendingUp className="h-3.5 w-3.5" />
            Visualizations
          </div>
          <p className="text-sm text-muted-foreground">
            Confusion matrix, prediction vs actual, error distribution, temporal accuracy, and optional word clouds live in
            the Visualizations section below. Drop PNGs in `frontend/public/` (see README) and they’ll render instantly.
          </p>
          <p className="text-xs text-muted-foreground">
            Need new assets? Run <code className="bg-muted px-1 py-0.5 rounded text-[11px]">python generate_visualizations.py</code> or call the helpers in
            `src/visualize.py` after training.
          </p>
        </Card>
      </div>
    </section>
  )
}
