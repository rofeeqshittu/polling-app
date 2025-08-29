import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, BarChart3 } from "lucide-react"
import Link from "next/link"

// Mock data matching the screenshots exactly
const mockPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    description: "What programming language do you prefer to use?",
    options: [
      { id: "1", text: "JavaScript", votes: 45 },
      { id: "2", text: "Python", votes: 38 },
      { id: "3", text: "Java", votes: 22 },
      { id: "4", text: "C#", votes: 15 },
      { id: "5", text: "Go", votes: 12 }
    ],
    createdBy: "You",
    isActive: true,
    allowMultipleVotes: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date()
  },
  {
    id: "2",
    title: "Best Frontend Framework",
    description: "Which frontend framework do you think is the best?",
    options: [
      { id: "6", text: "React", votes: 28 },
      { id: "7", text: "Vue.js", votes: 25 },
      { id: "8", text: "Angular", votes: 18 },
      { id: "9", text: "Svelte", votes: 12 }
    ],
    createdBy: "You",
    isActive: true,
    allowMultipleVotes: true,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2023-10-10"),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "Preferred Database",
    description: "What database do you prefer to work with?",
    options: [
      { id: "10", text: "PostgreSQL", votes: 35 },
      { id: "11", text: "MongoDB", votes: 42 },
      { id: "12", text: "MySQL", votes: 28 },
      { id: "13", text: "Redis", votes: 19 },
      { id: "14", text: "SQLite", votes: 15 }
    ],
    createdBy: "You",
    isActive: true,
    allowMultipleVotes: false,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2023-10-05"),
    updatedAt: new Date()
  }
]

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Polls</h1>
          <p className="text-gray-600 mt-2">Manage and track your created polls</p>
        </div>
        <Button asChild>
          <Link href="/polls/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New Poll
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search your polls..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Polls Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <PollCard key={poll.id} poll={poll} showVoteButton={false} />
        ))}
      </div>

      {/* Empty State */}
      {mockPolls.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No polls yet</h3>
                <p className="text-gray-500 mt-1">
                  Create your first poll to start gathering opinions!
                </p>
              </div>
              <Button asChild>
                <Link href="/polls/create">Create your first poll</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 