"use client";


import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
// ...existing code...

export default function PollDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  // Use Poll type from types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [poll, setPoll] = useState<import("@/types").Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Voting state (must be at top, not after conditional returns)
  // Support single or multiple selection
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [voteSuccess, setVoteSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/polls/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.error || "Failed to fetch poll.");
          setPoll(null);
        } else {
          setPoll(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to fetch poll.");
        setPoll(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading poll...
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error || "Poll not found."}
      </div>
    );
  }

  const handleVote = async (e: React.FormEvent) => {
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
          userId: user ? user.id : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setVoteError(data.error || "Failed to submit vote.");
      } else {
        setVoteSuccess("Vote submitted successfully!");
        // Refresh poll data after voting
        fetch(`/api/polls/${poll.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) setPoll(data.data);
          });
      }
    } catch (err: any) {
      setVoteError(err?.message || "Failed to submit vote.");
    } finally {
      setVoteLoading(false);
    }
  };

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();
  const isActive = poll.isActive;
  const canVote = isActive && !isExpired;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/polls">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Polls
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Poll options and voting UI */}
          <form onSubmit={handleVote} className="space-y-6">
            <div className="space-y-2">
              <p className="font-semibold">Select option{poll.allowMultipleVotes ? 's' : ''} to vote:</p>
              {poll.options?.map((option: any) => (
                <label key={option.id} className="flex items-center space-x-2">
                  <input
                    type={poll.allowMultipleVotes ? "checkbox" : "radio"}
                    name="option"
                    value={option.id}
                    checked={poll.allowMultipleVotes
                      ? selectedOptions.includes(option.id)
                      : selectedOptions[0] === option.id}
                    onChange={e => {
                      if (poll.allowMultipleVotes) {
                        if (e.target.checked) {
                          setSelectedOptions(prev => [...prev, option.id]);
                        } else {
                          setSelectedOptions(prev => prev.filter(id => id !== option.id));
                        }
                      } else {
                        setSelectedOptions([option.id]);
                      }
                    }}
                    className="h-4 w-4"
                    disabled={!canVote}
                  />
                  <span>{option.text}</span>
                  <span className="ml-2 text-xs text-gray-500">({option.votes} votes)</span>
                </label>
              ))}
            </div>
            {!canVote && (
              <div className="text-red-600 text-sm">
                {isExpired ? "Poll has expired." : "Poll is not active."}
              </div>
            )}
            {voteError && <div className="text-red-600 text-sm">{voteError}</div>}
            {voteSuccess && <div className="text-green-600 text-sm">{voteSuccess}</div>}
            <Button type="submit" disabled={voteLoading || !canVote || selectedOptions.length === 0}>
              {voteLoading ? "Submitting..." : "Submit Vote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
