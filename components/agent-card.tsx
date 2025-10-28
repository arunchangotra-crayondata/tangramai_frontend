import Link from "next/link"
import { Badge } from "./badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface AgentCardProps {
  id: string
  title: string
  description: string
  badges: Array<{ label: string; variant?: "default" | "primary" | "secondary" | "outline" }>
  tags: string[]
  assetType?: string
}

export function AgentCard({ id, title, description, badges, tags, assetType }: AgentCardProps) {
  return (
    <Link href={`/agents/${id}`}>
      <Card className="h-full transition-shadow hover:shadow-lg relative">
        {assetType && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
              {assetType}
            </Badge>
          </div>
        )}
        <CardHeader className={assetType ? "pr-24" : ""}>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || "default"}>
                {badge.label}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
