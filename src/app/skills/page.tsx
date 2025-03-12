import { Search } from "lucide-react"
import ToolCard from "@/components/tool-card"

export default function StackPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Tools I Use Daily</h1>
          <p className="text-gray-400 mb-8">
            A curated list of my favorite tools, frameworks, and services that power my projects.
          </p>

          <div className="relative mb-12">
            <div className="flex items-center border border-gray-800 rounded-md bg-gray-900/50 px-3 py-2">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search tools..."
                className="bg-transparent border-none outline-none w-full text-sm text-gray-300"
              />
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">Frontend Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToolCard
                icon="nextjs"
                name="Next.js"
                description="React framework for production-grade applications"
                tags={["React", "SSR", "TypeScript"]}
              />
              <ToolCard
                icon="typescript"
                name="TypeScript"
                description="Strongly typed programming language for JavaScript"
                tags={["Language", "JavaScript"]}
              />
              <ToolCard
                icon="react"
                name="React"
                description="Library for building user interfaces"
                tags={["UI", "Components"]}
              />
              <ToolCard
                icon="tailwind"
                name="Tailwind CSS"
                description="Utility-first CSS framework"
                tags={["CSS", "Styling"]}
              />
              <ToolCard
                icon="shadcn"
                name="shadcn/ui"
                description="Re-usable components built with Radix UI and Tailwind"
                tags={["Components", "UI", "Tailwind"]}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6 text-gray-300">Backend Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToolCard
                icon="prisma"
                name="Prisma"
                description="Next-generation ORM for Node.js and TypeScript"
                tags={["ORM", "Database"]}
              />
              <ToolCard
                icon="postgresql"
                name="PostgreSQL"
                description="Advanced open source database"
                tags={["Database", "SQL"]}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

