export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  createdBy: string
  isActive: boolean
  allowMultipleVotes: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface PollVote {
  id: string
  pollId: string
  userId: string
  optionIds: string[]
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreatePollRequest {
  title: string
  description?: string
  options: string[]
  allowMultipleVotes: boolean
  expiresAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
} 