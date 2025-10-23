import Link from "next/link"
import { Badge } from "./badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface AgentCardProps {
  id: string
  title: string
  description: string
  badges: Array<{ label: string; variant?: "default" | "primary" | "secondary" | "outline" }>
  tags: string[]
}

export function AgentCard({ id, title, description, badges, tags }: AgentCardProps) {
  return (
    <Link href={`/agents/${id}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader>
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
