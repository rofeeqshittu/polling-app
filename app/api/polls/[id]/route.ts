import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase";
import { ApiResponse, Poll } from "@/types";

export async function GET(
  request: NextRequest
) {
  try {
    if (!supabaseServiceRole) {
      throw new Error("Supabase service role client is not configured.");
    }
    // Next.js dynamic API routes require awaiting request.nextUrl
    const url = request.nextUrl;
    const pollId = url.pathname.split("/").pop();
    if (!pollId) {
      return NextResponse.json({ success: false, error: "No poll ID provided." }, { status: 400 });
    }
    // Fetch poll and its options
    const { data: poll, error: pollError } = await supabaseServiceRole
      .from("polls")
      .select("*, options(*)")
      .eq("id", pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ success: false, error: "Poll not found." }, { status: 404 });
    }

    // Fetch vote counts for each option
    const optionIds = (poll.options || []).map((option: any) => option.id);
    let voteCounts: Record<string, number> = {};
    if (optionIds.length > 0) {
      const { data: votes, error: votesError } = await supabaseServiceRole
        .from("votes")
        .select("option_id")
        .in("option_id", optionIds);
      if (!votesError && votes) {
        voteCounts = votes.reduce((acc: Record<string, number>, vote: any) => {
          acc[vote.option_id] = (acc[vote.option_id] || 0) + 1;
          return acc;
        }, {});
      }
    }

    const formattedPoll: Poll = {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      options: (poll.options || []).map((option: any) => ({
        id: option.id,
        text: option.text,
        votes: voteCounts[option.id] || 0,
      })),
      createdBy: poll.user_id || "Anonymous",
      isActive: poll.is_active,
      allowMultipleVotes: poll.allow_multiple_votes,
      expiresAt: poll.expires_at ? new Date(poll.expires_at) : undefined,
      createdAt: new Date(poll.created_at),
      updatedAt: new Date(poll.updated_at),
    };

    const response: ApiResponse<Poll> = {
      success: true,
      data: formattedPoll,
      message: "Poll retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch poll." }, { status: 500 });
  }
}
