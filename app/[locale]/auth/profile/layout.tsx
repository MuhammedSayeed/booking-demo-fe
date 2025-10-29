import type React from "react"
import { Suspense } from "react"
import ProtectedRoute from "@/components/protected-route"
import { Loader2 } from "lucide-react"

function ProfileLoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    </div>
  )
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<ProfileLoadingFallback />}>
          {children}
        </Suspense>
      </div>
    </ProtectedRoute>
  )
}

export const metadata = {
  title: "Profile | Booking Engine",
  description: "Manage your profile, security settings, and view reservations",
}
