

import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, Poll } from "@/types";
import { supabaseServiceRole } from "@/lib/supabase";

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseServiceRole) {
      throw new Error("Supabase service role client is not configured.");
    }
    const body = await request.json();
    const ids: string[] = body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: "No poll IDs provided." }, { status: 400 });
    }

    // Delete options first (to avoid FK constraint errors)
    const { error: optionsError } = await supabaseServiceRole
      .from("options")
      .delete()
      .in("poll_id", ids);
    if (optionsError) {
      console.error("Error deleting poll options:", optionsError);
      return NextResponse.json({ success: false, error: "Failed to delete poll options." }, { status: 500 });
    }

    // Delete polls
    const { error: pollsError } = await supabaseServiceRole
      .from("polls")
      .delete()
      .in("id", ids);
    if (pollsError) {
      console.error("Error deleting polls:", pollsError);
      return NextResponse.json({ success: false, error: "Failed to delete polls." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Polls deleted successfully." });
  } catch (error) {
    console.error("Error deleting polls:", error);
    return NextResponse.json({ success: false, error: "Failed to delete polls." }, { status: 500 });
  }
}



export async function GET() {
  try {
    if (!supabaseServiceRole) {
      throw new Error("Supabase service role client is not configured.");
    }
    // Fetch all polls and their options
    const { data: polls, error: pollError } = await supabaseServiceRole
      .from("polls")
      .select("*, options(*)")
      .order("created_at", { ascending: false });

    if (pollError) {
      console.error("Error fetching polls:", pollError);
      return NextResponse.json({ success: false, error: "Failed to fetch polls" }, { status: 500 });
    }

    // Gather all option IDs
    const allOptionIds = (polls || []).flatMap((poll: any) => (poll.options || []).map((option: any) => option.id));
    let allVoteCounts: Record<string, number> = {};
    if (allOptionIds.length > 0) {
      const { data: votes, error: votesError } = await supabaseServiceRole
        .from("votes")
        .select("option_id")
        .in("option_id", allOptionIds);
      if (!votesError && votes) {
        allVoteCounts = votes.reduce((acc: Record<string, number>, vote: any) => {
          acc[vote.option_id] = (acc[vote.option_id] || 0) + 1;
          return acc;
        }, {});
      }
    }

    const formattedPolls: Poll[] = (polls || []).map((poll: any) => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      options: (poll.options || []).map((option: any) => ({
        id: option.id,
        text: option.text,
        votes: allVoteCounts[option.id] || 0,
      })),
      createdBy: poll.user_id || "Anonymous",
      isActive: poll.is_active,
      allowMultipleVotes: poll.allow_multiple_votes,
      expiresAt: poll.expires_at ? new Date(poll.expires_at) : undefined,
      createdAt: new Date(poll.created_at),
      updatedAt: new Date(poll.updated_at),
    }));

    const response: ApiResponse<Poll[]> = {
      success: true,
      data: formattedPolls,
      message: "Polls retrieved successfully"
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch polls" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    if (!supabaseServiceRole) {
      throw new Error("Supabase service role client is not configured.");
    }
    const body = await request.json();
  const { title, description, options, allowMultipleVotes, requireLogin, expiresAt, userId, userName } = body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ success: false, error: "Invalid poll data" }, { status: 400 });
    }

  // Use userId and userName from body (sent by frontend)

    // Insert poll
    const { data: pollData, error: pollError } = await supabaseServiceRole
      .from("polls")
      .insert([
        {
          title,
          description,
          user_id: userId,
          user_name: userName,
          allow_multiple_votes: !!allowMultipleVotes,
          require_login: !!requireLogin,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (pollError || !pollData) {
      console.error("Error inserting poll:", pollError);
      return NextResponse.json({ success: false, error: "Failed to create poll" }, { status: 400 });
    }

    // Insert options
    const optionInserts = options.map((text: string) => ({ poll_id: pollData.id, text }));
    const { data: optionsData, error: optionsError } = await supabaseServiceRole
      .from("options")
      .insert(optionInserts)
      .select();

    if (optionsError || !optionsData) {
      console.error("Error inserting options:", optionsError);
      return NextResponse.json({ success: false, error: "Failed to create poll options" }, { status: 400 });
    }

    const response: ApiResponse<Poll> = {
      success: true,
      data: {
        id: pollData.id,
        title: pollData.title,
        description: pollData.description,
        options: optionsData.map((option: any) => ({
          id: option.id,
          text: option.text,
          votes: 0,
        })),
        createdBy: pollData.user_name || pollData.user_id || "Anonymous",
        isActive: pollData.is_active,
        allowMultipleVotes: pollData.allow_multiple_votes,
        expiresAt: pollData.expires_at ? new Date(pollData.expires_at) : undefined,
        createdAt: new Date(pollData.created_at),
        updatedAt: new Date(pollData.updated_at),
      },
      message: "Poll created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json({ success: false, error: "Failed to create poll" }, { status: 500 });
  }
}


