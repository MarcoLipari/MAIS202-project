import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProjectOverview } from "@/components/project-overview"
import { TeamMembers } from "@/components/team-members"
import { WhatItDoes } from "@/components/what-it-does"
import { Dataset } from "@/components/dataset"
import { Methodology } from "@/components/methodology"
import { Demo } from "@/components/demo"
import { Conclusion } from "@/components/conclusion"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="page-shell">
      <div className="page-shell-content">
        <Navbar />
        <Hero />
        <ProjectOverview />
        <TeamMembers />
        <WhatItDoes />
        <Dataset />
        <Methodology />
        <Demo />
        <Conclusion />
        <Footer />
      </div>
    </div>
  )
}
