"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Search,
  CalendarIcon,
  Wifi,
  Coffee,
  Tv,
  Utensils,
  Car,
  Snowflake,
  Dumbbell,
  Bath,
  Filter,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Hotel } from "@/interfaces/hotel";
import { useTranslations } from "next-intl";
function HoteCard({ hotels }: { hotels: Hotel[] }) {
    const tMain = useTranslations();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <Card key={hotel.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-1/3">
              <Image
                src={hotel.images[0]?.image || "/hero/hero-1.jpg"}
                alt={hotel.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {hotel.city.name}, {hotel.country.name}
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center bg-primary/10 text-primary rounded-md px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-primary mr-1" />
              <span className="text-sm font-medium">4.8</span>
            </div> */}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {hotel.amenities.slice(0, 5).map((amenity) => (
                  <div
                    key={amenity.id}
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: amenity.amenity.icon }}
                  />
                ))}
                {hotel.amenities.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{hotel.amenities.length - 5} more
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-end mt-4">
                <div>
                  <span className="text-xl font-bold">
                    {tMain("Contact Us")}
                  </span>
                  <Link
                    href={`tel:${hotel.phone}`}
                    className="text-muted-foreground text-sm block"
                  >
                    {hotel.phone}
                  </Link>
                </div>
                <Button
                  asChild
                  className="bg-primary  text-white"
                >
                  <Link href={`/hotels/${hotel.id}`}>
                    {tMain("View Details")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default HoteCard;
