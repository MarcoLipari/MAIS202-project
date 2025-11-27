import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { getGitHubRepoUrl } from "@/lib/config"

export function GitHubSection() {
  return (
    <section id="github" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Github className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold">View on GitHub</h2>
        </div>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our complete codebase, Jupyter notebooks, and documentation. All preprocessing scripts, model
          implementations, and evaluation metrics are available in the repository.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <a href={getGitHubRepoUrl()} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-5 w-5" />
            Visit Repository
          </a>
        </Button>
      </div>
    </section>
  )
}
