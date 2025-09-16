"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2, BarChart3, Calendar, User, CheckCircle, Edit, Trash2, Copy, Twitter, Vote } from "lucide-react"
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
  const [pollData, setPollData] = useState(mockPoll)
  const [showResults, setShowResults] = useState(false)

  const { id } = require('react').use(params);
  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0)
  const isExpired = pollData.expiresAt && new Date(pollData.expiresAt) < new Date()

  // Check if user has already voted (in real app, check localStorage or database)
  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]')
    if (votedPolls.includes(id)) {
      setHasVoted(true)
      setShowResults(true)
    }
  }, [id])

  const handleOptionSelect = (optionId: string) => {
    if (pollData.allowMultipleVotes) {
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
    
    try {
      // Simulate API call to submit vote
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local poll data with new votes
      const updatedOptions = pollData.options.map(option => ({
        ...option,
        votes: selectedOptions.includes(option.id) ? option.votes + 1 : option.votes
      }))
      
      setPollData(prev => ({ ...prev, options: updatedOptions }))
      
      // Mark as voted and show results
      setHasVoted(true)
      setShowResults(true)
      
      // Store in localStorage (in real app, this would be in database)
      const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]')
      if (!votedPolls.includes(params.id)) {
        localStorage.setItem('votedPolls', JSON.stringify([...votedPolls, params.id]))
      }
      
      console.log("Vote submitted successfully for options:", selectedOptions)
    } catch (error) {
      console.error("Error submitting vote:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    // TODO: Show toast notification
  }

  const shareOnTwitter = () => {
    const text = `Vote on "${pollData.title}" - ${window.location.href}`
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

  const renderVotingForm = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Cast Your Vote
        </CardTitle>
        <CardDescription>
          {pollData.allowMultipleVotes 
            ? "Select one or more options that you prefer"
            : "Select the option that best represents your choice"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {pollData.options.map((option) => (
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
        
        <Button 
          onClick={handleVote} 
          disabled={selectedOptions.length === 0 || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting Vote...
            </>
          ) : (
            "Submit Vote"
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const renderResults = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Poll Results
        </CardTitle>
        <CardDescription>
          {hasVoted ? "Thank you for voting! Here are the current results:" : "This poll is no longer active"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pollData.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
            const isSelected = selectedOptions.includes(option.id)
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.text}</span>
                    {isSelected && hasVoted && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Your Vote
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {option.votes} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isSelected && hasVoted ? 'bg-blue-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Total votes: <span className="font-semibold">{totalVotes}</span>
            </p>
            {hasVoted && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Your vote has been recorded!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pollData.title}</h1>
            <p className="text-lg text-gray-600">{pollData.description}</p>
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

        {/* Poll Metadata */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Created by {pollData.createdBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created on {pollData.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>{totalVotes} total votes</span>
              </div>
              {pollData.allowMultipleVotes && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Multiple votes allowed
                </span>
              )}
              {isExpired && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                  Poll Expired
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Voting Form or Results */}
        {!hasVoted && pollData.isActive && !isExpired ? (
          renderVotingForm()
        ) : (
          renderResults()
        )}

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