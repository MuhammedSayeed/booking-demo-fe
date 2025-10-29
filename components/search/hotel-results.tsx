"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"

interface Hotel {
  id: string
  name: string
  destination: string
  price: number
  rating: number
  reviews: number
  image?: string
  description?: string
}

interface HotelResultsProps {
  hotels: Hotel[]
  loading: boolean
  error: string
}

export default function HotelResults({ hotels, loading, error }: HotelResultsProps) {
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          <p className="font-semibold">Error loading hotels</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No hotels found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Available Hotels ({hotels.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            {hotel.image && (
              <div className="h-48 bg-muted overflow-hidden">
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-foreground text-lg mb-1">{hotel.name}</h3>

              <p className="text-sm text-muted-foreground mb-3">{hotel.destination}</p>

              {hotel.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{hotel.description}</p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">{hotel.rating}</span>
                  <span className="text-xs text-muted-foreground">({hotel.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Per night</span>
                <span className="text-xl font-bold text-primary">${hotel.price}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
