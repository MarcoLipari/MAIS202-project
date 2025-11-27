"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Calendar, ExternalLink, Sparkles } from "lucide-react"
import { getGitHubRepoUrl } from "@/lib/config"

export function Demo() {
  const [inputText, setInputText] = useState("")
  const [predictedYear, setPredictedYear] = useState<string | null>(null)
  const [predictionData, setPredictionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePredict = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    // Clear previous prediction
    setPredictedYear(null)
    setPredictionData(null)
    
    try {
      // Use relative API path (proxied through Next.js to backend)
      const apiUrl = "/api/predict"
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText.trim(),
          task_type: "classification", // 2-bin classifier: 2008-2010 vs 2020-2022
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      // Use predicted_year_range if available (2-bin classifier), otherwise use predicted_year
      const displayYear = data.predicted_year_range || data.predicted_year?.toString() || "N/A"
      setPredictedYear(displayYear)
      setPredictionData(data)
    } catch (error) {
      console.error("Prediction error:", error)
      // Fallback to placeholder if API is not available
      const randomRange = Math.random() > 0.5 ? "2008-2010" : "2020-2022"
      setPredictedYear(randomRange)
      alert("API not available. Showing placeholder result. Make sure the backend server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-accent/10 border border-accent/20">
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Interactive Demo
          </h2>
        </div>

        <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
          <div className="space-y-6">
            <div>
              <label htmlFor="comment-input" className="block text-sm font-medium mb-2">
                Enter a Reddit-style comment:
              </label>
              <Textarea
                id="comment-input"
                placeholder="Type your comment here... e.g., 'This meme is fire fr fr no cap'"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  // Clear prediction when user starts typing a new comment
                  if (predictedYear) {
                    setPredictedYear(null)
                    setPredictionData(null)
                  }
                }}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button
              onClick={handlePredict}
              disabled={!inputText.trim() || isLoading}
              size="lg"
              className="w-full gap-2"
            >
              <Calendar className="h-5 w-5" />
              {isLoading ? "Predicting..." : "Predict Year"}
            </Button>

            {predictedYear && (
              <div className="p-8 bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 border-2 border-accent/30 rounded-2xl text-center relative overflow-hidden shadow-2xl hover:shadow-accent/30 transition-all card-hover">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent opacity-60" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                      Predicted Time Period
                    </p>
                    <div className="inline-block p-6 rounded-2xl bg-background/60 backdrop-blur-md border-2 border-accent/40 mb-4 shadow-xl hover:scale-105 transition-transform">
                      <p className="text-5xl font-bold bg-gradient-to-r from-accent via-accent/90 to-accent bg-clip-text text-transparent animate-pulse">
                        {predictedYear}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">Note:</strong> This demo uses a 2-bin classifier model that predicts whether a comment is from 
                <strong className="text-foreground"> 2008-2010</strong> or <strong className="text-foreground">2020-2022</strong>.
              </p>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                <a
                  href={getGitHubRepoUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
