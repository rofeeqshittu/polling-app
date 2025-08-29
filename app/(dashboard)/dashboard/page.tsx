import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, BarChart3, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockUserPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers for their daily development work.",
    options: [
      { id: "1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "2", text: "Python", votes: 38 },
      { id: "3", text: "Java", votes: 22 },
      { id: "4", text: "C++", votes: 15 },
      { id: "5", text: "Go", votes: 12 }
    ],
    createdBy: "You",
    isActive: true,
    allowMultipleVotes: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    title: "Which framework should we use for the next project?",
    description: "Help us decide on the tech stack for our upcoming web application.",
    options: [
      { id: "6", text: "Next.js", votes: 28 },
      { id: "7", text: "React", votes: 25 },
      { id: "8", text: "Vue.js", votes: 18 },
      { id: "9", text: "Angular", votes: 12 }
    ],
    createdBy: "You",
    isActive: true,
    allowMultipleVotes: true,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockRecentActivity = [
  { id: "1", action: "Voted on 'Best coffee shop in the city?'", time: "2 hours ago" },
  { id: "2", action: "Created new poll 'What's your favorite programming language?'", time: "1 day ago" },
  { id: "3", action: "Voted on 'Which framework should we use?'", time: "2 days ago" },
  { id: "4", action: "Shared poll 'Best coffee shop in the city?'", time: "3 days ago" }
]

export default function DashboardPage() {
  const totalPolls = mockUserPolls.length
  const totalVotes = mockUserPolls.reduce((sum, poll) => 
    sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0), 0
  )
  const activePolls = mockUserPolls.filter(poll => poll.isActive).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your polls.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Polls</p>
                <p className="text-2xl font-bold text-gray-900">{totalPolls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Polls</p>
                <p className="text-2xl font-bold text-gray-900">{activePolls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Response</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPolls > 0 ? Math.round(totalVotes / totalPolls) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Your Polls */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Polls</h2>
            <Button asChild>
              <Link href="/polls/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </Link>
            </Button>
          </div>

          {mockUserPolls.length > 0 ? (
            <div className="space-y-4">
              {mockUserPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} showVoteButton={false} />
              ))}
            </div>
          ) : (
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

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 