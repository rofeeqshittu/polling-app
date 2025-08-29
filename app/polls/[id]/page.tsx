"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2, BarChart3, Calendar, User, CheckCircle, Edit, Trash2, Copy, Twitter } from "lucide-react"
import Link from "next/link"

// Mock poll data - in real app this would come from API
const mockPoll = {
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
  createdBy: "John Doe",
  isActive: true,
  allowMultipleVotes: false,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  createdAt: new Date("2023-10-15"),
  updatedAt: new Date()
}

export default function PollPage({ params }: { params: { id: string } }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareSection, setShowShareSection] = useState(false)

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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    // TODO: Show toast notification
  }

  const shareOnTwitter = () => {
    const text = `Vote on "${mockPoll.title}" - ${window.location.href}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleEdit = () => {
    // TODO: Navigate to edit page or open edit modal
    console.log("Edit poll clicked")
  }

  const handleDelete = () => {
    // TODO: Show delete confirmation modal
    if (confirm("Are you sure you want to delete this poll?")) {
      console.log("Delete poll clicked")
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
        {/* Poll Header with Edit/Delete */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockPoll.title}</h1>
            <p className="text-lg text-gray-600">{mockPoll.description}</p>
          </div>
          <div className="flex space-x-2 ml-4">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Poll
            </Button>
            <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Poll Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Poll Options */}
            <div className="space-y-3 mb-6">
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
            
            {/* Submit Button */}
            {!hasVoted && mockPoll.isActive && !isExpired && (
              <Button 
                onClick={handleVote} 
                disabled={selectedOptions.length === 0 || isLoading}
                className="w-full"
              >
                {isLoading ? "Submitting..." : "Submit Vote"}
              </Button>
            )}

            {/* Poll Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-6 pt-4 border-t">
              <span>Created by {mockPoll.createdBy}</span>
              <span>Created on {mockPoll.createdAt.toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Share Section */}
        <Card>
          <CardHeader>
            <CardTitle>Share this poll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={copyLink} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" onClick={shareOnTwitter} className="flex-1">
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 