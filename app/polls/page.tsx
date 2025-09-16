"use client";
import { PollCard } from "@/components/polls/poll-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, BarChart3 } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function PollsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

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

  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((pollId) => pollId !== id)
    );
  };

  const handleDelete = async (ids: string[]) => {
    if (!ids.length) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/polls", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to delete polls.");
      } else {
        setSelected([]);
        fetchPolls();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to delete polls.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header & Mass Delete & Select All */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Polls</h1>
            <p className="text-gray-600 mt-2">Manage and track your created polls</p>
          </div>
          <div className="flex gap-2 items-center">
            {polls.length > 0 && (
              <>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selected.length === polls.length && polls.length > 0}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelected(polls.map((p: any) => p.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  {/* TODO: Revisit indeterminate state for checkbox */}
                  <span className="text-sm">Select All</span>
                </label>
                <Button
                  variant="destructive"
                  disabled={deleting || selected.length === 0}
                  onClick={() => handleDelete(selected)}
                >
                  {deleting ? "Deleting..." : `Delete Selected (${selected.length})`}
                </Button>
              </>
            )}
            <Button asChild>
              <Link href="/polls/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Poll
              </Link>
            </Button>
          </div>
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

        {/* Polls Grid, Loading, Error, Empty State */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading polls...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-medium">{error}</div>
        ) : polls.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll: any) => (
              <PollCard
                key={poll.id}
                poll={poll}
                showVoteButton={false}
                selected={selected.includes(poll.id)}
                onSelect={(checked: boolean) => handleSelect(poll.id, checked)}
                onDelete={() => handleDelete([poll.id])}
                deleting={deleting}
              />
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
                  <p className="text-gray-500 mt-1">Create your first poll to start gathering opinions!</p>
                </div>
                <Button asChild>
                  <Link href="/polls/create">Create your first poll</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">Select All</span>
              </label>
              <Button
                variant="destructive"
                disabled={deleting || selected.length === 0}
                onClick={() => handleDelete(selected)}
              >
                {deleting ? "Deleting..." : `Delete Selected (${selected.length})`}
              </Button>
            </>
          )}
          <Button asChild>
            <Link href="/polls/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Poll
            </Link>
          </Button>
        </div>
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

      {/* Polls Grid, Loading, Error, Empty State */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading polls...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 font-medium">{error}</div>
      ) : polls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll: any) => (
            <PollCard
              key={poll.id}
              poll={poll}
              showVoteButton={false}
              selected={selected.includes(poll.id)}
              onSelect={(checked: boolean) => handleSelect(poll.id, checked)}
              onDelete={() => handleDelete([poll.id])}
              deleting={deleting}
            />
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
  )
}
