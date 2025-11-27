import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

const quickStats = [
  { label: "Era Coverage", value: "2006 → 2024", detail: "18 years of Reddit" },
  { label: "Comments Touched", value: "2.3M+", detail: "Sampled & cleaned" },
  { label: "Models", value: "RoBERTa-base", detail: "2-bin + regression" },
]

const highlights = [
  {
    title: "Temporal Fingerprinting",
    body: "Language alone tells us which Reddit era a comment belongs to. We treat slang, emoji density, and cultural references as signals.",
  },
  {
    title: "Fast Demo-Ready Model",
    body: "A distilled 2-bin RoBERTa classifier (2008-2010 vs 2020-2022) powers the live demo with 85.3% accuracy and millisecond latency.",
  },
  {
    title: "Regression Fallback",
    body: "A RoBERTa regression head predicts a concrete year across 2006-2024 when longer-range granularity is needed.",
  },
]

export function ProjectOverview() {
  return (
    <section id="overview" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Live Research Prototype
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Linguistic change, quantified.
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We built a RoBERTa-based system that predicts when a Reddit comment was posted using only its wording. The model
            reads cultural references, slang, and stylistic cues to place language inside the correct era.
          </p>
        </div>

        <Card className="p-10 card-hover border-2 border-accent/20 hover:border-accent/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl opacity-60" />
          <div className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-gradient-to-br from-background via-background to-accent/5 border border-border/70 hover:border-accent/40 transition-all hover:-translate-y-1"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="p-6 rounded-2xl glass border border-border/30 space-y-3">
                  <p className="text-sm font-semibold text-accent uppercase tracking-widest">{highlight.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {highlight.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border border-border/60 rounded-2xl px-6 py-5 bg-secondary/40">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Deliverable</p>
                <p className="text-lg font-semibold text-foreground">Project-fair ready storytelling + live demo</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                  85.3% accuracy
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted font-semibold">
                  3 epoch fine-tune
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
