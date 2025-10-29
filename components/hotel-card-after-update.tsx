"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { MapPin, Star } from "lucide-react";
import { HotelAfterUpdate } from "@/interfaces/hotel";
import { useTranslations } from "next-intl";
function HoteCardAfterUpdate({ hotels }: { hotels: HotelAfterUpdate[] }) {
  const tMain = useTranslations();
  // console.log("hotels=> ", hotels);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <Card key={hotel.hotel_id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-1/3">
              <Image
                src={hotel.images[0]?.image || "/hero/hero-1.jpg"}
                alt={hotel.hotel_name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{hotel.hotel_name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{hotel.hotel_address}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <span className="font-medium">{hotel.hotel_category}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mt-4">
                <div>
                  <span className="text-xl font-bold">
                    SAR {hotel.total_price}
                  </span>
                </div>
                <Button
                  asChild
                  className="bg-primary  text-white"
                >
                  <Link href={`/hotels/${hotel.hotel_id}`}>
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

export default HoteCardAfterUpdate;
