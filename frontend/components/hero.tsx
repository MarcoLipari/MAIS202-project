import { Button } from "@/components/ui/button"
import { Github, TrendingUp, Calendar, Brain } from "lucide-react"
import { getGitHubRepoUrl } from "@/lib/config"

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 gradient-animated opacity-10" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-float">
          <Brain className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-accent">NLP & Machine Learning</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance fade-in-up">
          <span className="text-gradient inline-block">Modeling Linguistic Change</span>
          <br />
          <span className="text-foreground inline-block">Over Time on Reddit</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-balance mb-8 leading-relaxed">
          Using transformer-based NLP models to estimate when a Reddit comment was written
          <span className="block mt-2 text-accent font-semibold">2006 → 2024</span>
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl glass hover-lift border border-accent/20 shadow-lg hover:shadow-accent/30 transition-all group">
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">85%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl glass hover-lift border border-accent/20 shadow-lg hover:shadow-accent/30 transition-all group">
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">18</div>
              <div className="text-xs text-muted-foreground">Years</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl glass hover-lift border border-accent/20 shadow-lg hover:shadow-accent/30 transition-all group">
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">2</div>
              <div className="text-xs text-muted-foreground">Models</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <span className="px-4 py-2 rounded-full bg-secondary/60 border border-border/70 text-sm font-medium text-muted-foreground">
            RoBERTa-base · 2-bin classifier
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all pulse-glow hover:scale-105" asChild>
            <a href={getGitHubRepoUrl()} target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          </Button>
          <Button size="lg" variant="outline" className="gap-2 border-2 hover:bg-accent/10 hover:border-accent/50 hover:scale-105 transition-all" asChild>
            <a href="#demo">
              Try the Demo
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
