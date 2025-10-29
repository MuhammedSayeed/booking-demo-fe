import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Tag } from "lucide-react"

export function SpecialOffers() {
  const offers = [
    {
      id: 1,
      title: "Summer Getaway: 25% Off",
      description:
        "Enjoy a summer vacation with 25% off at select beach resorts. Book by July 31st for stays until September 30th.",
      image: "/placeholder.svg?height=250&width=500",
      expiry: "July 31, 2025",
      discount: "25%",
      tag: "Limited Time",
    },
    {
      id: 2,
      title: "Weekend City Escape",
      description:
        "Book a 2-night weekend stay in any major city hotel and get complimentary breakfast and late checkout.",
      image: "/placeholder.svg?height=250&width=500",
      expiry: "August 15, 2025",
      discount: "Free Breakfast",
      tag: "Weekend Special",
    },
    {
      id: 3,
      title: "Luxury for Less",
      description:
        "Experience 5-star luxury at 4-star prices with our exclusive luxury hotel collection. Includes spa credit.",
      image: "/placeholder.svg?height=250&width=500",
      expiry: "September 30, 2025",
      discount: "Up to 30%",
      tag: "Luxury",
    },
  ]

  return (
    <section className="container py-12 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Special Offers</h2>
          <p className="text-muted-foreground mt-2">Exclusive deals and limited-time offers for your next stay</p>
        </div>
        <Button asChild variant="outline" className="mt-4 md:mt-0">
          <Link href="/offers">View all offers</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden h-full">
            <div className="relative h-48">
              <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-primary">{offer.tag}</Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{offer.description}</p>

              <div className="flex flex-col space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Tag className="h-4 w-4 mr-2 text-primary" />
                  <span>Save {offer.discount}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>Expires: {offer.expiry}</span>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href={`/offers/${offer.id}`}>View Offer</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
