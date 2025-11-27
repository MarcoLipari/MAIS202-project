"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, CalendarClock, Cpu, Presentation, Hash, Smile, TrendingUp, Globe } from "lucide-react"

const workflow = [
  {
    title: "Curate + Clean",
    description: "1.3TB of Pushshift Reddit data sampled to ~20K comments per month.",
    icon: CalendarClock,
    stat: "20K / month",
  },
  {
    title: "Model the Eras",
    description: "Fine-tune RoBERTa-base to spot linguistic fingerprints of 2008-2010 vs 2020-2022.",
    icon: Cpu,
    stat: "3 epoch FT",
  },
  {
    title: "Demo in Real Time",
    description: "FastAPI serves predictions to the Next.js frontend in <200ms per request.",
    icon: Presentation,
    stat: "<200ms",
  },
]

const signals = [
  { icon: Hash, label: "Slang density & emoji usage" },
  { icon: Smile, label: "Meme + pop-culture references" },
  { icon: TrendingUp, label: "Political tone + sentiment shifts" },
  { icon: Globe, label: "Global events mentioned in context" },
]

export function WhatItDoes() {
  const handleScrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="what-it-does" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/40">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground">Experience</p>
          <h2 className="text-3xl font-bold">What the system actually does</h2>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Type any Reddit-style comment. We return the era that best explains its wording, plus confidence and class
            probabilities.
          </p>
        </div>

        <Card className="p-8 border-2 border-accent/20 hover:border-accent/40 transition-all card-hover relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-60" />
          <div className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workflow.map(({ title, description, icon: Icon, stat }) => (
                <div key={title} className="p-5 rounded-2xl bg-background/80 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Signals we read</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {signals.map(({ icon: Icon, label }) => (
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

            <p className="text-sm text-muted-foreground">
              Under the hood we also log class probabilities, so we can demonstrate how confidently the model recognizes a
              specific era’s language.
            </p>
          </div>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleScrollToDemo}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all pulse-glow hover:scale-105"
          >
            <MessageSquare className="h-5 w-5" />
            Launch the demo
          </Button>
        </div>
      </div>
    </section>
  )
}
