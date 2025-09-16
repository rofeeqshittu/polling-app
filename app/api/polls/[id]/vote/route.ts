import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase";
import { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServiceRole) {
      throw new Error("Supabase service role client is not configured.");
    }
    const body = await request.json();
    const { pollId, optionIds, userId } = body;
    if (!pollId || !optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid vote data." }, { status: 400 });
    }
    // Insert vote
    const { data: voteData, error: voteError } = await supabaseServiceRole
      .from("votes")
      .insert([
        {
          poll_id: pollId,
          option_id: optionIds[0], // Only support single option for now
          user_id: userId || null,
        },
      ])
      .select()
      .single();
    if (voteError || !voteData) {
      return NextResponse.json({ success: false, error: "Failed to submit vote." }, { status: 400 });
    }
    // Optionally increment vote count (if using a counter)
    // Not needed if you always count votes from the votes table
    return NextResponse.json({ success: true, message: "Vote submitted successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to submit vote." }, { status: 500 });
  }
}
