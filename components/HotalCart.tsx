"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Coffee, Tv, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Hotel } from "@/interfaces/hotel";
import getSearchResults from "@/lib/search";
import { getAmenityIcon } from "./featured-hotels";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import BASEURL from "@/context/handleAPIDomain";

function HotalCart() {
  const [hotels, sethotel] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const hotalsData = await getSearchResults({
        api: `${BASEURL}/hotels/api/v1/?lang=${locale}`,
        search: "",
        page: "",
      });
      sethotel(hotalsData.results);
      setLoading(false);
    };
    fetchData();
  }, []);
  // // // console.log(hotels);
  const tMain = useTranslations();

  if (loading) {
    return (
      <>
        <div className="max-w-sm w-full mx-auto p-4 border border-gray-300 rounded-md shadow animate-pulse bg-white dark:bg-gray-800">
          <div className="h-48 bg-gray-300 rounded-md mb-4 dark:bg-gray-700"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6 dark:bg-gray-700"></div>
          <div className="flex space-x-2">
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
        </div>{" "}
        <div className="max-w-sm w-full mx-auto p-4 border border-gray-300 rounded-md shadow animate-pulse bg-white dark:bg-gray-800">
          <div className="h-48 bg-gray-300 rounded-md mb-4 dark:bg-gray-700"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6 dark:bg-gray-700"></div>
          <div className="flex space-x-2">
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="max-w-sm w-full mx-auto p-4 border border-gray-300 rounded-md shadow animate-pulse bg-white dark:bg-gray-800">
          <div className="h-48 bg-gray-300 rounded-md mb-4 dark:bg-gray-700"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6 dark:bg-gray-700"></div>
          <div className="flex space-x-2">
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
        </div>{" "}
        <div className="max-w-sm w-full mx-auto p-4 border border-gray-300 rounded-md shadow animate-pulse bg-white dark:bg-gray-800">
          <div className="h-48 bg-gray-300 rounded-md mb-4 dark:bg-gray-700"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6 dark:bg-gray-700"></div>
          <div className="flex space-x-2">
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
        </div>{" "}
        <div className="max-w-sm w-full mx-auto p-4 border border-gray-300 rounded-md shadow animate-pulse bg-white dark:bg-gray-800">
          <div className="h-48 bg-gray-300 rounded-md mb-4 dark:bg-gray-700"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6 dark:bg-gray-700"></div>
          <div className="flex space-x-2">
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
            <div className="h-10 flex-1 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {hotels.slice(0, 8).map((hotel) => (
        <Card key={hotel.id} className="overflow-hidden group ">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={hotel?.images[0]?.image || "/hero/hero-2.jpg"}
              alt={hotel.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {/* {hotel.discount && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                15% OFF
              </Badge>
            )} */}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {hotel.name}
                </h3>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span className="line-clamp-1">
                    {hotel.address.slice(0, 20)}
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center bg-primary/10 text-primary rounded-md px-2 py-1">
                <Star className="h-3.5 w-3.5 fill-primary mr-1" />
                <span className="text-sm font-medium">{hotel.rating}</span>
              </div> */}
            </div>

            <div className="flex items-center gap-2 mt-3">
              {hotel.amenities?.map((amenity, index) => (
                <div
                  key={typeof amenity === "string" ? amenity : amenity.id}
                  className="text-muted-foreground"
                  title={amenity.amenity.name}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: amenity.amenity.icon,
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto ">
            {/* <div>
              <span className="text-xl font-bold">${hotel.price}</span>
              <span className="text-muted-foreground text-sm"> / night</span>
            </div> */}
            <Button
              asChild
              size="sm"
              className="bg-primary  text-white"
            >
              <Link href={`/hotels/${hotel.id}`}>{tMain("View Details")}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default HotalCart;
