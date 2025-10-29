import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Coffee, Tv, Utensils } from "lucide-react";
import HotalCart from "./HotalCart";
import ContentHeaderHotels from "./ContentHeaderHotels";

export const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return <Wifi className="h-4 w-4" />;
    case "breakfast":
      return <Coffee className="h-4 w-4" />;
    case "tv":
      return <Tv className="h-4 w-4" />;
    case "restaurant":
      return <Utensils className="h-4 w-4" />;
    default:
      return null;
  }
};
export function FeaturedHotels() {
  return (
    <section className="container py-12 md:py-16">
      <ContentHeaderHotels />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <HotalCart />
      </div>
    </section>
  );
}
