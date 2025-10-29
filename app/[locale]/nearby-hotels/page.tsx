"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeroSlider } from "@/components/hero-slider"
import { MapPin, Star, Navigation, List, Loader2 } from "lucide-react"

export default function NearbyHotelsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")

  // Hero slider images
  const heroImages = [
    "/placeholder.svg?height=400&width=1920&text=Discover+Nearby+Hotels",
    "/placeholder.svg?height=400&width=1920&text=Find+Your+Perfect+Stay",
    "/placeholder.svg?height=400&width=1920&text=Explore+Local+Accommodations",
  ]

  // Mock nearby hotels data
  const nearbyHotels = [
    {
      id: 1,
      name: "Grand Plaza Hotel",
      distance: 0.8,
      rating: 4.8,
      price: 299,
      image: "/placeholder.svg?height=200&width=300",
      lat: 40.7128,
      lng: -74.006,
    },
    {
      id: 2,
      name: "Riverside Inn",
      distance: 1.2,
      rating: 4.5,
      price: 199,
      image: "/placeholder.svg?height=200&width=300",
      lat: 40.7138,
      lng: -74.013,
    },
    {
      id: 3,
      name: "Urban Boutique Hotel",
      distance: 1.5,
      rating: 4.6,
      price: 279,
      image: "/placeholder.svg?height=200&width=300",
      lat: 40.7118,
      lng: -74.009,
    },
    {
      id: 4,
      name: "Luxury Suites Downtown",
      distance: 1.7,
      rating: 4.9,
      price: 349,
      image: "/placeholder.svg?height=200&width=300",
      lat: 40.7148,
      lng: -74.002,
    },
    {
      id: 5,
      name: "Heritage Hotel",
      distance: 2.1,
      rating: 4.4,
      price: 229,
      image: "/placeholder.svg?height=200&width=300",
      lat: 40.7108,
      lng: -74.016,
    },
  ]

  // Simulate getting user location
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock user location (New York City coordinates)
      setUserLocation({ lat: 40.7128, lng: -74.006 })
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex-1">
      {/* Hero Section with Slider */}
      <section className="relative h-[400px] w-full">
        <HeroSlider images={heroImages}>
          <div className="flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Hotels Near You</h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8">
              Discover the best accommodations in your area with real-time availability
            </p>

            {/* Search Form */}
            <div className="w-full max-w-md">
              <div className="relative">
                <Input placeholder="Enter your location or use current position" className="pl-10 bg-white/95 h-12" />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-10" size="sm">
                  <Navigation className="h-4 w-4 mr-2" />
                  Near Me
                </Button>
              </div>
            </div>
          </div>
        </HeroSlider>
      </section>

      <div className="container py-8">
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nearby Hotels</h2>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")}>
              <TabsList>
                <TabsTrigger value="map" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Map View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Finding hotels near you...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map View */}
            {viewMode === "map" && (
              <div className="lg:col-span-2">
                <div className="relative h-[600px] rounded-lg overflow-hidden border">
                  <div className="absolute inset-0 bg-muted">
                    {/* Mock Map - In a real app, you would use a map library like Google Maps, Mapbox, or Leaflet */}
                    <div className="relative w-full h-full">
                      <Image
                        src="/placeholder.svg?height=600&width=800&text=Interactive+Map"
                        alt="Map of nearby hotels"
                        fill
                        className="object-cover"
                      />

                      {/* Hotel Markers */}
                      {nearbyHotels.map((hotel) => (
                        <div
                          key={hotel.id}
                          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            top: `${30 + Math.random() * 40}%`,
                            left: `${30 + Math.random() * 40}%`,
                          }}
                        >
                          <div className="bg-primary text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white p-2 rounded shadow-md text-xs font-medium whitespace-nowrap">
                            {hotel.name}
                          </div>
                        </div>
                      ))}

                      {/* User Location Marker */}
                      <div
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                        style={{ top: "50%", left: "50%" }}
                      >
                        <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg animate-pulse">
                          <Navigation className="h-5 w-5" />
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white p-2 rounded shadow-md text-xs font-medium">
                          Your Location
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hotel List */}
            <div className={viewMode === "map" ? "lg:col-span-1" : "lg:col-span-3"}>
              <div
                className={`grid ${viewMode === "map" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-4`}
              >
                {nearbyHotels.map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden">
                    <div className="relative h-40">
                      <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                      <Badge className="absolute top-2 right-2 bg-primary">{hotel.distance} miles away</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{hotel.name}</h3>
                          <div className="flex items-center text-muted-foreground text-sm mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{hotel.distance} miles from you</span>
                          </div>
                        </div>
                        <div className="flex items-center bg-primary/10 text-primary rounded-md px-2 py-1">
                          <Star className="h-3.5 w-3.5 fill-primary mr-1" />
                          <span className="text-sm font-medium">{hotel.rating}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <span className="text-xl font-bold">${hotel.price}</span>
                          <span className="text-muted-foreground text-sm"> / night</span>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/hotels/${hotel.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
