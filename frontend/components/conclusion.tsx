import { Card } from "@/components/ui/card"
import { Lightbulb, ArrowRight } from "lucide-react"

const nextSteps = [
  "Ship the trained classifier weights so the demo always uses the higher-accuracy model.",
  "Experiment with DeBERTa-v3 or Longformer for richer temporal capture.",
  "Collect a human baseline to compare against our automated predictions.",
  "Expand bins (or move to regression) once we have more balanced data.",
]

export function Conclusion() {
  return (
    <section id="conclusion" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Lightbulb className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold text-center">Conclusion</h2>
        </div>

        <Card className="p-10 card-hover border-2 border-accent/20 hover:border-accent/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/15 transition-all duration-500" />
          <div className="space-y-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 border-2 border-accent/30 shadow-xl hover:scale-105 transition-transform">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Demo Accuracy</p>
                <div className="text-6xl font-bold bg-gradient-to-r from-accent via-accent/90 to-accent bg-clip-text text-transparent">85%</div>
                <p className="text-sm font-semibold text-muted-foreground mt-3">2-bin classifier (2008-2010 vs 2020-2022)</p>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Language alone reveals when a Reddit comment was written. Our RoBERTa stack captures 18 years of linguistic
                drift and surfaces it in a project-fair-ready demo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60">
                <p className="font-semibold text-foreground mb-2">What works</p>
                <ul className="space-y-2">
                  <li>• Balanced sampling keeps eras equally represented</li>
                  <li>• Class probabilities make the experience explainable</li>
                  <li>• Regression fallback ensures `/predict` never breaks</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60">
                <p className="font-semibold text-foreground mb-2">What’s next</p>
                <ul className="space-y-2">
                  {nextSteps.map((step) => (
                    <li key={step} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
