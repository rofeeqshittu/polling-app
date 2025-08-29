import { CreatePollForm } from "@/components/forms/create-poll-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/polls">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Link>
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create a New Poll</h1>
          <p className="text-gray-600 mt-2">
            Design your poll and start gathering opinions from your community
          </p>
        </div>
      </div>

      {/* Form */}
      <CreatePollForm />
    </div>
  )
} 