  // Make onVoted accessible in handleVote
"use client"

import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, BarChart3 } from "lucide-react"
import Link from "next/link"
import QRCode from "react-qr-code"
import React from "react"

interface PollCardProps {
  poll: Poll
  showVoteButton?: boolean
  selected?: boolean
  onSelect?: (checked: boolean) => void
  onDelete?: () => void
  deleting?: boolean
  onVoted?: () => void
}

export function PollCard({ poll, showVoteButton = true, selected, onSelect, onDelete, deleting, onVoted }: PollCardProps) {
  const [showQr, setShowQr] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [voteLoading, setVoteLoading] = React.useState(false);
  const [voteError, setVoteError] = React.useState<string | null>(null);
  const [voteSuccess, setVoteSuccess] = React.useState<string | null>(null);
  const [pollData, setPollData] = React.useState<Poll>(poll);

  const canVote = poll.isActive && !(poll.expiresAt && new Date(poll.expiresAt) < new Date());

  async function handleVote(e: React.FormEvent) {
    e.preventDefault();
    setVoteLoading(true);
    setVoteError(null);
    setVoteSuccess(null);
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId: poll.id,
          optionIds: selectedOptions,
          userId: poll.createdBy // or null for anonymous, adjust as needed
        })
      });
      const data = await res.json();
      if (!data.success) {
        setVoteError(data.error || "Failed to submit vote.");
      } else {
        setVoteSuccess("Vote submitted successfully!");
        // Refresh poll data after voting
        try {
          const res = await fetch(`/api/polls/${poll.id}`);
          const data = await res.json();
          if (data.success && data.data) {
            setPollData(data.data);
          }
        } catch {}
        if (typeof onVoted === "function") {
          onVoted();
        }
      }
    } catch (err: any) {
      setVoteError(err?.message || "Failed to submit vote.");
    }
    setVoteLoading(false);
  }
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
          <form onSubmit={handleVote} className="space-y-2">
            {pollData.options.map((option) => {
              const totalVotes = pollData.options.reduce((sum, o) => sum + o.votes, 0);
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <div key={option.id} className="space-y-1">
                  <label className="flex items-center space-x-2">
                    <input
                      type={pollData.allowMultipleVotes ? "checkbox" : "radio"}
                      name="option"
                      value={option.id}
                      checked={pollData.allowMultipleVotes
                        ? selectedOptions.includes(option.id)
                        : selectedOptions[0] === option.id}
                      onChange={e => {
                        if (pollData.allowMultipleVotes) {
                          if (e.target.checked) {
                            setSelectedOptions(prev => [...prev, option.id]);
                          } else {
                            setSelectedOptions(prev => prev.filter(id => id !== option.id));
                          }
                        } else {
                          setSelectedOptions([option.id]);
                        }
                      }}
                      disabled={!canVote || voteLoading}
                    />
                    <span>{option.text}</span>
                    <span className="ml-2 text-xs text-gray-500">({option.votes} votes)</span>
                  </label>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="submit"
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
              disabled={!canVote || voteLoading || selectedOptions.length === 0}
            >
              {voteLoading ? "Voting..." : "Vote"}
            </button>
            {voteError && <div className="text-red-600 text-sm">{voteError}</div>}
            {voteSuccess && <div className="text-green-600 text-sm">{voteSuccess}</div>}
          </form>
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
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/polls/${poll.id}`}>View Results</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowQr(true)}>
              Share
            </Button>
            {showQr && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                  <h3 className="mb-2 font-semibold">Scan to Share Poll</h3>
                  <QRCode value={typeof window !== 'undefined' ? window.location.origin + `/polls/${poll.id}` : ''} style={{ height: 180, width: 180 }} />
                  <Button className="mt-4" onClick={() => setShowQr(false)}>Close</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 