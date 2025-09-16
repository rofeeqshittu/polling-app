"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, BarChart3, Users, TrendingUp, Clock } from "lucide-react";
import { PollCard } from "@/components/polls/poll-card";
// ...existing code...

import React from "react";

import { Poll } from "@/types";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    supabase
      .from("polls")
      .select("*, options(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError("Failed to fetch polls.");
          setPolls([]);
        } else {
          setPolls(data || []);
        }
        setLoading(false);
      });
  }, [user]);

  // Stats
  const totalPolls = polls.length;
  const totalVotes = polls.reduce(
    (sum, poll) =>
      sum +
      (poll.options?.reduce(
        (pollSum: number, option: any) => pollSum + (option.votes || 0),
        0,
      ) || 0),
    0,
  );
  const activePolls = polls.filter((poll: any) => poll.is_active).length;

  // Placeholder recent activity (can be replaced with real data later)
  const recentActivity = [
    {
      id: "1",
      action: "Created new poll",
      time: "Just now",
    },
    {
      id: "2",
      action: "Voted on a poll",
      time: "1 day ago",
    },
    {
      id: "3",
      action: "Shared a poll",
      time: "2 days ago",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here’s what’s happening with your polls.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Polls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPolls}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Votes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalVotes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Polls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activePolls}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Response
                  </p>
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
              <h2 className="text-xl font-semibold text-gray-900">
                Your Polls
              </h2>
              <Button asChild>
                <Link href="/polls/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </Link>
              </Button>
            </div>
            {loading || authLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="text-gray-500 animate-pulse">
                  Loading your polls...
                </span>
              </div>
            ) : error ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Error
                      </h3>
                      <p className="text-gray-500 mt-1">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : polls.length > 0 ? (
              <div className="space-y-4">
                {polls.map((poll: any) => (
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
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.action}
                        </p>
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
    </ProtectedRoute>
  );
}
