import { SiNextdotjs, SiTypescript, SiReact, SiTailwindcss, SiPrisma, SiPostgresql } from "react-icons/si"

interface ToolCardProps {
  icon: string
  name: string
  description: string
  tags: string[]
}

export default function ToolCard({ icon, name, description, tags }: ToolCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-4">
        <div className="mt-1">{getIconComponent(icon)}</div>
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getIconComponent(icon: string) {
  const iconSize = 24

  switch (icon.toLowerCase()) {
    case "nextjs":
      return <SiNextdotjs size={iconSize} className="text-white" />
    case "typescript":
      return <SiTypescript size={iconSize} className="text-blue-400" />
    case "react":
      return <SiReact size={iconSize} className="text-blue-500" />
    case "tailwind":
      return <SiTailwindcss size={iconSize} className="text-cyan-400" />
    case "shadcn":
      return (
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 19.5H22L12 2Z" fill="currentColor" />
          </svg>
        </div>
      )
    case "prisma":
      return <SiPrisma size={iconSize} className="text-white" />
    case "postgresql":
      return <SiPostgresql size={iconSize} className="text-blue-400" />
    default:
      return null
  }
}

