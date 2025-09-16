"use client";
import { PollCard } from "@/components/polls/poll-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PollsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/polls");
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to fetch polls.");
        setPolls([]);
      } else {
        setPolls(data.data || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch polls.");
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header and Intro */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Polls</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Discover polls created by the community. Vote, share, and see what others think!
        </p>
        <Button asChild className="mt-4">
          <Link href="/polls/create">
            <Plus className="h-4 w-4 mr-2" /> Create a New Poll
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading polls...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 font-medium">
          {error}
        </div>
      ) : polls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll: any) => (
            <PollCard key={poll.id} poll={poll} showVoteButton={false} onVoted={fetchPolls} />
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
                <h3 className="text-lg font-medium text-gray-900">
                  No polls yet
                </h3>
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
  );
}
