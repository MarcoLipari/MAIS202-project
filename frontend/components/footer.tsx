"use client"

import { Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGitHubRepoUrl } from "@/lib/config"
import { useState, useEffect } from "react"

export function Footer() {
  const [logoError, setLogoError] = useState(false)

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Modeling Linguistic Change Over Time on Reddit</h3>
          <p className="text-muted-foreground">
            <span className="text-foreground">MAIS Machine Learning Bootcamp Fall 2025</span>
          </p>

          <div className="py-4">
            <div className="flex items-center justify-center">
              {!logoError ? (
                <img 
                  src="/mcgill-logo.png" 
                  alt="McGill University" 
                  className="h-20 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-32 h-20 mx-auto bg-secondary/50 rounded-lg border border-border flex items-center justify-center">
                  <p className="text-xs text-muted-foreground text-center">
                    McGill
                    <br />
                    Logo
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
              <a href={getGitHubRepoUrl()} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                GitHub Repository
              </a>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
              <a href="mailto:royelia43@gmail.com">
                <Mail className="h-4 w-4" />
                Email Contact
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4">© 2025 MAIS Machine Learning Bootcamp Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
