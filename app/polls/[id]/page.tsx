"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2, BarChart3, Calendar, User, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock poll data - in real app this would come from API
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Let's see what the community prefers for their daily development work. This poll will help us understand the most popular languages and frameworks among developers.",
  options: [
    { id: "1", text: "JavaScript/TypeScript", votes: 45 },
    { id: "2", text: "Python", votes: 38 },
    { id: "3", text: "Java", votes: 22 },
    { id: "4", text: "C++", votes: 15 },
    { id: "5", text: "Go", votes: 12 }
  ],
  createdBy: "John Doe",
  isActive: true,
  allowMultipleVotes: false,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function PollPage({ params }: { params: { id: string } }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalVotes = mockPoll.options.reduce((sum, option) => sum + option.votes, 0)
  const isExpired = mockPoll.expiresAt && new Date(mockPoll.expiresAt) < new Date()

  const handleOptionSelect = (optionId: string) => {
    if (mockPoll.allowMultipleVotes) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  const handleVote = async () => {
    if (selectedOptions.length === 0) return
    
    setIsLoading(true)
    
    // TODO: Implement voting logic
    console.log("Voting for options:", selectedOptions)
    
    // Simulate API call
    setTimeout(() => {
      setHasVoted(true)
      setIsLoading(false)
    }, 1000)
  }

  const sharePoll = () => {
    if (navigator.share) {
      navigator.share({
        title: mockPoll.title,
        text: mockPoll.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/polls">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Poll Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">{mockPoll.title}</CardTitle>
                {mockPoll.description && (
                  <CardDescription className="text-lg">
                    {mockPoll.description}
                  </CardDescription>
                )}
              </div>
              <Button variant="outline" onClick={sharePoll}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Created by {mockPoll.createdBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {isExpired ? "Expired" : `Expires ${mockPoll.expiresAt?.toLocaleDateString()}`}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>{totalVotes} total votes</span>
              </div>
              {mockPoll.allowMultipleVotes && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Multiple votes allowed
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Voting Section */}
        {!hasVoted && mockPoll.isActive && !isExpired ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
              <CardDescription>
                {mockPoll.allowMultipleVotes 
                  ? "Select one or more options that you prefer"
                  : "Select the option that best represents your choice"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPoll.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOptions.includes(option.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOptions.includes(option.id)
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}>
                        {selectedOptions.includes(option.id) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-lg">{option.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={handleVote} 
                  disabled={selectedOptions.length === 0 || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Submitting vote..." : "Submit Vote"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Poll Results</CardTitle>
              <CardDescription>
                {hasVoted ? "Thank you for voting!" : "This poll is no longer active"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPoll.options.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-muted-foreground">
                          {option.votes} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Poll Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Poll Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
                <div className="text-sm text-muted-foreground">Total Votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mockPoll.options.length}</div>
                <div className="text-sm text-muted-foreground">Options</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {mockPoll.allowMultipleVotes ? "Yes" : "No"}
                </div>
                <div className="text-sm text-muted-foreground">Multiple Votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {mockPoll.isActive ? "Active" : "Inactive"}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 