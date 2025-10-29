"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { HotelChain } from "@/interfaces/hotel";
import getSingleHotelResults from "@/lib/singleHotel";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import BASEURL from "@/context/handleAPIDomain";
function Chains() {
  const [destinations, setdestinations] = useState<HotelChain[]>([]);
  const tMain = useTranslations();
  const [loading, setLoading] = useState(true);
  const { locale } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const hotalsData = await getSingleHotelResults({
        api: `${BASEURL}/hotels/api/v1/hotel-chains?lang=${locale}`,
      });
      setdestinations(hotalsData.results);
      setLoading(false);
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="container my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    );
  }
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="container my-12 ">
      <h1 className="text-3xl font-bold tracking-tight text-primary mb-10">
        {tMain("Popular Chains")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((destination) => (
          <Link
            dir={locale === "ar" ? "rtl" : "ltr"}
            href={`/hotels?destination=${destination.name}`}
            key={destination.id}
          >
            <Card className="overflow-hidden h-full group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <Image
                  alt={destination.name}
                  src={destination.logo || "/hero/hero-1.jpg"}
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center text-muted-foreground">
                  <span>{destination.description.slice(0, 90)}...</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Chains;
