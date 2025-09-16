"use client"

import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, BarChart3 } from "lucide-react"
import Link from "next/link"

interface PollCardProps {
  poll: Poll
  showVoteButton?: boolean
  selected?: boolean
  onSelect?: (checked: boolean) => void
  onDelete?: () => void
  deleting?: boolean
}

export function PollCard({ poll, showVoteButton = true, selected, onSelect, onDelete, deleting }: PollCardProps) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="line-clamp-2">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>{totalVotes} votes</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Selection checkbox and delete button */}
          <div className="flex items-center justify-between mb-2">
            <input
              type="checkbox"
              checked={!!(typeof selected !== 'undefined' && selected)}
              onChange={e => onSelect && onSelect(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 mr-2"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={!!deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
          {/* Poll options preview */}
          <div className="space-y-2">
            {poll.options.slice(0, 3).map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{option.text}</span>
                    <span className="text-muted-foreground">{option.votes} votes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {poll.options.length > 3 && (
              <p className="text-sm text-muted-foreground">
                +{poll.options.length - 3} more options
              </p>
            )}
          </div>
          {/* ...existing code... */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Created by {poll.createdBy}</span>
              </div>
              {poll.expiresAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {isExpired ? "Expired" : `Expires ${new Date(poll.expiresAt).toLocaleDateString()}`}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {poll.allowMultipleVotes && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Multiple votes
                </span>
              )}
              {!poll.isActive && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            {showVoteButton && poll.isActive && !isExpired ? (
              <Button asChild className="flex-1">
                <Link href={`/polls/${poll.id}`}>Vote Now</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/polls/${poll.id}`}>View Results</Link>
              </Button>
            )}
            <Button variant="outline" size="sm">
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 