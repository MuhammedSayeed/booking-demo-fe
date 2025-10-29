import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center py-16">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" asChild>
          <Link href="/hotels">
            <Search className="mr-2 h-4 w-4" />
            Browse Hotels
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">Return to home</Link>
        </Button>
      </div>
    </div>
  )
}
