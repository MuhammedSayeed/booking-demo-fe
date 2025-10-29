import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Wifi,
  Coffee,
  Utensils,
  Car,
  Dumbbell,
  Bath,
  Waves,
  Users,
  Briefcase,
  Martini,
  Plane,
  ShoppingBag,
} from "lucide-react"

export default function FacilitiesPage() {
  const facilities = [
    {
      category: "wellness",
      items: [
        {
          name: "Luxury Spa",
          description:
            "Our award-winning spa offers a range of treatments including massages, facials, and body wraps in a tranquil environment.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Treatment rooms", "Sauna", "Steam room", "Relaxation lounge"],
        },
        {
          name: "Fitness Center",
          description:
            "State-of-the-art fitness center equipped with the latest cardio and strength training equipment, open 24/7 for your convenience.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Modern equipment", "Personal trainers", "Yoga studio", "24/7 access"],
        },
        {
          name: "Swimming Pools",
          description:
            "Enjoy our indoor and outdoor swimming pools with dedicated lanes for lap swimming and relaxation areas.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Indoor pool", "Outdoor pool", "Jacuzzi", "Kids pool"],
        },
      ],
    },
    {
      category: "dining",
      items: [
        {
          name: "Fine Dining Restaurant",
          description:
            "Experience exquisite cuisine prepared by our award-winning chefs using the finest local and international ingredients.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Gourmet menu", "Wine pairing", "Private dining", "Seasonal specialties"],
        },
        {
          name: "Casual Bistro",
          description:
            "Enjoy casual dining in a relaxed atmosphere with a menu featuring international favorites and local specialties.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["All-day dining", "Family-friendly", "Outdoor seating", "Buffet options"],
        },
        {
          name: "Rooftop Bar",
          description:
            "Sip cocktails and enjoy panoramic views at our stylish rooftop bar, the perfect place to unwind after a day of exploration.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Craft cocktails", "Panoramic views", "Live music", "Tapas menu"],
        },
      ],
    },
    {
      category: "business",
      items: [
        {
          name: "Conference Center",
          description:
            "Our versatile conference center can accommodate events of all sizes, from intimate board meetings to large conferences.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Multiple rooms", "AV equipment", "Catering services", "Technical support"],
        },
        {
          name: "Business Lounge",
          description:
            "A dedicated space for business travelers with high-speed internet, printing services, and private meeting areas.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["High-speed WiFi", "Printing services", "Private booths", "Refreshments"],
        },
        {
          name: "Co-working Space",
          description:
            "Modern co-working space designed for productivity with comfortable seating, high-speed internet, and complimentary beverages.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Ergonomic workstations", "Meeting pods", "Coffee bar", "Networking events"],
        },
      ],
    },
    {
      category: "services",
      items: [
        {
          name: "Concierge Services",
          description:
            "Our knowledgeable concierge team is available 24/7 to assist with restaurant reservations, tour bookings, and local recommendations.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["24/7 availability", "Local expertise", "Personalized recommendations", "Ticket booking"],
        },
        {
          name: "Airport Transfers",
          description:
            "Enjoy seamless travel with our luxury airport transfer service, available for arrivals and departures.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Luxury vehicles", "Professional drivers", "Flight tracking", "Door-to-door service"],
        },
        {
          name: "Shopping Services",
          description:
            "From personal shopping assistants to exclusive boutique access, we make your shopping experience memorable.",
          image: "/placeholder.svg?height=300&width=500",
          features: ["Personal shoppers", "VIP access", "Package delivery", "Gift wrapping"],
        },
      ],
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wellness":
        return <Bath className="h-5 w-5" />
      case "dining":
        return <Utensils className="h-5 w-5" />
      case "business":
        return <Briefcase className="h-5 w-5" />
      case "services":
        return <Users className="h-5 w-5" />
      default:
        return null
    }
  }

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes("wifi")) return <Wifi className="h-4 w-4" />
    if (feature.toLowerCase().includes("coffee") || feature.toLowerCase().includes("refreshment"))
      return <Coffee className="h-4 w-4" />
    if (
      feature.toLowerCase().includes("dining") ||
      feature.toLowerCase().includes("restaurant") ||
      feature.toLowerCase().includes("menu")
    )
      return <Utensils className="h-4 w-4" />
    if (feature.toLowerCase().includes("parking") || feature.toLowerCase().includes("vehicle"))
      return <Car className="h-4 w-4" />
    if (feature.toLowerCase().includes("fitness") || feature.toLowerCase().includes("gym"))
      return <Dumbbell className="h-4 w-4" />
    if (feature.toLowerCase().includes("spa") || feature.toLowerCase().includes("sauna"))
      return <Bath className="h-4 w-4" />
    if (feature.toLowerCase().includes("pool") || feature.toLowerCase().includes("jacuzzi"))
      return <Waves className="h-4 w-4" />
    if (feature.toLowerCase().includes("service") || feature.toLowerCase().includes("support"))
      return <Users className="h-4 w-4" />
    if (feature.toLowerCase().includes("business") || feature.toLowerCase().includes("meeting"))
      return <Briefcase className="h-4 w-4" />
    if (feature.toLowerCase().includes("bar") || feature.toLowerCase().includes("cocktail"))
      return <Martini className="h-4 w-4" />
    if (feature.toLowerCase().includes("airport") || feature.toLowerCase().includes("transfer"))
      return <Plane className="h-4 w-4" />
    if (feature.toLowerCase().includes("shopping") || feature.toLowerCase().includes("boutique"))
      return <ShoppingBag className="h-4 w-4" />
    return null
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Hotel Facilities</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the premium amenities and services available at our partner hotels to enhance your stay.
        </p>
      </div>

      <Tabs defaultValue="wellness" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="wellness" className="flex items-center gap-2">
            <Bath className="h-4 w-4" />
            <span>Wellness</span>
          </TabsTrigger>
          <TabsTrigger value="dining" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span>Dining</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Business</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Services</span>
          </TabsTrigger>
        </TabsList>

        {facilities.map((category) => (
          <TabsContent key={category.category} value={category.category} className="space-y-8">
            {category.items.map((facility) => (
              <Card key={facility.name} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={facility.image || "/placeholder.svg"}
                      alt={facility.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(category.category)}
                      <h2 className="text-2xl font-semibold">{facility.name}</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">{facility.description}</p>
                    <div className="space-y-2">
                      <h3 className="font-medium">Features:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {facility.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="flex items-center gap-2 w-fit">
                            {getFeatureIcon(feature)}
                            <span>{feature}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
