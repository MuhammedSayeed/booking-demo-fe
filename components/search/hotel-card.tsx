import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Globe } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

interface Hotel {
    id: string
    name: string
    category: string
    address: string
    city: {
        id: string
        name: string
        country: {
            name: string
            code: string
        }
    }
    images: any[]
    amenities: any[]
    phone?: string
    website?: string
    check_in_time?: string
    check_out_time?: string
}

interface HotelCardProps {
    hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
    const starCount = hotel.category.match(/\d+/)?.[0] || "0"
    const imageUrl = hotel.images?.[0]?.url || "/grand-hotel-exterior.png"
    const tMain = useTranslations();

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
            {/* Image */}
            <div className="relative h-48 w-full bg-muted overflow-hidden">
                <Image
                    src="/hero/hero-1.jpg"
                    alt={hotel.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                />

            </div>

            {/* Content */}
            <CardContent className="pt-4 flex-1 flex flex-col">
                {/* Hotel Name */}
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{hotel.name}</h3>

                {/* Location */}
                <div className="flex items-start gap-1 mb-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="line-clamp-1">{hotel.address}</p>
                        <p className="text-xs">
                            {hotel.city.name}, {hotel.city.country.name}
                        </p>
                    </div>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                    <Badge variant="outline" className="text-xs">
                        {hotel.category}
                    </Badge>
                </div>

                {/* Check-in/out Times */}
                {(hotel.check_in_time || hotel.check_out_time) && (
                    <div className="text-xs text-muted-foreground mb-3 space-y-1">
                        {hotel.check_in_time && <p>Check-in: {hotel.check_in_time}</p>}
                        {hotel.check_out_time && <p>Check-out: {hotel.check_out_time}</p>}
                    </div>
                )}

                {/* Contact Info */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {hotel.phone && (
                        <a href={`tel:${hotel.phone}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Call
                        </a>
                    )}
                    {hotel.website && (
                        <a
                            href={hotel.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            <Globe className="h-3 w-3" />
                            Website
                        </a>
                    )}
                </div>

                {/* View Details Button */}
                <Button
                    asChild
                    className=" text-white"
                >
                    <Link href={`/hotels/${hotel.id}`}>
                        {tMain("View Details")}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
