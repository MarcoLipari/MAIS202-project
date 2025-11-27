import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

const team = [
  { name: "Marco Lipari" },
  { name: "Andrew Tomajian" },
  { name: "James Wnek" },
  { name: "Roy Elia" },
]

export function TeamMembers() {
  return (
    <section id="team" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Users className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold text-center">Team Members</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="p-6 text-center">
              <h3 className="text-xl font-semibold">{member.name}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
