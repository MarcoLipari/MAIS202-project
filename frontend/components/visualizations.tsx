"use client"

import { Card } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { useState } from "react"

// Helper component for images with fallback
function ImageWithFallback({ src, alt, fallbackText }: { src: string; alt: string; fallbackText: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-secondary/50 rounded-lg border border-border flex items-center justify-center">
        <p className="text-muted-foreground text-center p-4">
          {fallbackText}
          <br />
          <span className="text-xs">Add {src.split('/').pop()} to /public folder</span>
        </p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain"
      onError={() => setHasError(true)}
    />
  )
}

const vizCards = [
  {
    title: "Confusion Matrix",
    caption: "2-bin classifier performance (2008-2010 vs 2020-2022). Expect ~85% accuracy.",
    file: "/confusion-matrix.png",
  },
  {
    title: "Prediction vs Actual",
    caption: "Regression fallback predictions across 2006-2024.",
    file: "/prediction-vs-actual.png",
  },
  {
    title: "Error Distribution",
    caption: "How many years off the regression predictions are (MAE ≈ 4.4).",
    file: "/error-distribution.png",
  },
  {
    title: "Temporal Accuracy",
    caption: "Accuracy by year—peaks around early Reddit and pandemic-era language.",
    file: "/temporal-accuracy.png",
  },
]

export function Visualizations() {
  return (
    <section id="visualizations" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/40">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <BarChart3 className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold text-center">Visualizations</h2>
        </div>

        {/* All visualizations in 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vizCards.map(({ title, caption, file }) => (
            <Card key={title} className="p-5 hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/30">
              <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
              <div className="aspect-video bg-secondary/50 rounded-lg border border-border overflow-hidden mb-3 relative">
                <ImageWithFallback src={file} alt={title} fallbackText={title} />
              </div>
              <p className="text-sm text-muted-foreground text-center">{caption}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
