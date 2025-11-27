import { Card } from "@/components/ui/card"
import { Database, ExternalLink, Hash, FileText, Clock, Calendar, Layers, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGitHubRepoUrl } from "@/lib/config"

const datasetStats = [
  { label: "Raw archive", value: "1.3 TB", detail: "Pushshift Reddit dump" },
  { label: "Sampled volume", value: "≈ 20K / month", detail: "Stratified by subreddit" },
  { label: "Time span", value: "2006 – 2024", detail: "18 continuous years" },
]

const rowSchema = [
  { icon: Hash, label: "subreddit, subreddit_id" },
  { icon: FileText, label: "comment body" },
  { icon: Clock, label: "created_utc" },
  { icon: Calendar, label: "derived year + bin" },
]

const pipeline = [
  { icon: Layers, title: "Monthly sampling", body: "Pull RC_YYYY-MM.csv files from Pushshift torrents" },
  { icon: Filter, title: "Quality filters", body: "Remove deleted, bot, and ultra-short comments (<10 chars)" },
  { icon: Database, title: "Balanced splits", body: "Maintain equal representation for 2008-10 and 2020-22" },
]

export function Dataset() {
  return (
    <section id="dataset" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            <Database className="h-3.5 w-3.5" />
            Data Backbone
          </div>
          <h2 className="text-3xl font-bold">Dataset Summary</h2>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Data comes from the Pushshift Reddit archive via Academic Torrents. We sample each month evenly so the model
            doesn’t just memorize a single subreddit or era.
          </p>
        </div>

        <Card className="p-10 border-2 border-accent/20 hover:border-accent/40 transition-all card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-60" />
          <div className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {datasetStats.map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl bg-background/80 border border-border/60">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pipeline.map(({ icon: Icon, title, body }) => (
                <div key={title} className="p-5 rounded-2xl glass border border-border/40 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent">
                    <Icon className="h-4 w-4" />
                    {title}
                  </div>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">Row Schema</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rowSchema.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/70 border border-border/70 hover:border-accent/30 hover:bg-accent/5 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border border-border/70 rounded-2xl px-6 py-5 bg-secondary/50">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Preprocessing</p>
                <p className="text-sm text-muted-foreground">
                  Tokenization + normalization handled via the scripts below. Everything is reproducible.
                </p>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent" asChild>
                <a href={getGitHubRepoUrl()} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
