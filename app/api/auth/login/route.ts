import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { LoginRequest, ApiResponse } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const supabase = createServerClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })
    
    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error.message
      }
      return NextResponse.json(response, { status: 400 })
    }
    
    const response: ApiResponse<{ user: any }> = {
      success: true,
      data: {
        user: data.user
      },
      message: "Login successful"
    }
    
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Internal server error"
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 