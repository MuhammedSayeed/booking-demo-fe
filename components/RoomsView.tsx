"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Coffee, Tv, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import getSearchResults from "@/lib/search";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import BASEURL from "@/context/handleAPIDomain";
import { LoadingSpinner } from "./LoadingSpinner";
import axios from "axios";
import { CityOfRoomes } from "@/interfaces/hotel";
// import MapPage from "@/components/MapPage";
import dynamic from "next/dynamic";

// تحميل مكون الخريطة فقط في الكلاينت
const MapPage = dynamic(() => import("@/components/MapPage"), {
  ssr: false,
});
function RoomsView() {
  const [roomsView, setroomsView] = useState<CityOfRoomes[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams();
  const tMain = useTranslations();


  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${BASEURL}/hotels/api/v1/cities` , {
          headers :{
            "ngrok-skip-browser-warning": "true"
          }
        })
        .then((response) => {
          const allCities: CityOfRoomes[] = response.data.results;
          // console.log("allCities", allCities);
          setroomsView(allCities);
          // console.log("roomsView", roomsView);
        })
        .catch((err) => {
          console.log("Error fetching cities:", err);
        });
    };
    fetchData();
    setLoading(false);
  }, [locale]);

  if (loading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {tMain("Available Rooms")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {tMain(
                "Discover comfort and luxury in our carefully designed rooms"
              )}
            </p>
          </div>
          <LoadingSpinner
            size="lg"
            text={`${tMain("Loading available rooms")}...`}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {tMain("Available Rooms")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tMain(
              "Discover comfort and luxury in our carefully designed rooms"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomsView.slice(0, 6).map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden group hover:shadow-lg transition-shadow h-[300px]"
            >
              <div className="relative h-[40%] w-full">
                <MapPage
                  className="rounded-lg h-[30%] w-full object-cover z-[1]"
                  latitude={room.latitude ? +room.latitude : 0}
                  longitude={room.longitude ? +room.longitude : 0}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {room.name}
                  </h3>
                </div>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {room.name} - {room.country.name}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex items-center justify-between">
                <span>{room.country.name.slice(0, 100)}</span>
                <Link href={`/rooms?destination=${room.name}`}>
                  <Button className="bg-primary  text-white">
                    {tMain("Book Now")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/rooms">{tMain("View All Rooms")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default RoomsView;
