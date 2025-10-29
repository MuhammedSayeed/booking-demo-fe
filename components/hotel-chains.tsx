import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function HotelChains() {
  const chains = [
    {
      id: 1,
      name: "Marriott International",
      logo: "/placeholder.svg?height=100&width=200",
      hotels: 7500,
    },
    {
      id: 2,
      name: "Hilton Worldwide",
      logo: "/placeholder.svg?height=100&width=200",
      hotels: 6400,
    },
    {
      id: 3,
      name: "InterContinental Hotels Group",
      logo: "/placeholder.svg?height=100&width=200",
      hotels: 5900,
    },
    {
      id: 4,
      name: "Wyndham Hotels & Resorts",
      logo: "/placeholder.svg?height=100&width=200",
      hotels: 9200,
    },
    {
      id: 5,
      name: "Accor",
      logo: "/placeholder.svg?height=100&width=200",
      hotels: 5100,
    },
    {
      id: 6,
      name: "Hyatt Hotels Corporation",
      logo: "/placeholder.svg?height=100&width=200",
      hotels: 950,
    },
  ]

  return (
    <section className="bg-muted py-12 md:py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Hotel Chains</h2>
            <p className="text-muted-foreground mt-2">Browse hotels from the world's leading hotel chains</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/hotel-chains">View all chains</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {chains.map((chain) => (
            <Link href={`/hotels?chain=${chain.id}`} key={chain.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="relative h-12 w-full mb-4">
                    <Image src={chain.logo || "/placeholder.svg"} alt={chain.name} fill className="object-contain" />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{chain.name}</h3>
                  <p className="text-xs text-muted-foreground">{chain.hotels} hotels</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
