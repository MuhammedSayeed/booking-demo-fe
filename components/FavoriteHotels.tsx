"use client";
import finalBaseUrl from "@/context/handleAPIDomain";
import { Hotel } from "@/interfaces/hotel";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

function FavoriteHotels({ favoriteHotels }: { favoriteHotels: string }) {
  const { locale } = useParams();
  const [hotel, sethotel] = useState<Hotel>();
  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`${finalBaseUrl}/hotels/api/v1/${favoriteHotels}/?lang=${locale}` , {
          headers :{
            "ngrok-skip-browser-warning": "true"
          }
        })
        .then((res) => {
          const hotels = res.data as Hotel;
          sethotel(hotels);
        })
        .catch((error) => {
          console.error("Error fetching favorite hotels:", error);
        });
    };
    getData();
  }, []);

  if (!hotel) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        href={`/${locale}/hotels/${hotel.id}`}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="max-w-md mx-auto bg-white dark:bg-black dark:text-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl m-4"
      >
        <div className="">
          <div className="md:shrink-0">
            <img
              className="h-48 !w-[100%] object-fit md:h-full md:w-48"
              src={
                hotel.images[0].image ||
                "https://media.istockphoto.com/id/487042276/photo/hotel-sign.webp?s=2048x2048&w=is&k=20&c=DN8vdPYnwDU_gy78HbaHVZfI0Ok7gyEJRgt8tiWpeM8="
              }
              alt={`${hotel.name} logo`}
            />
          </div>
          <div className="p-6 ">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {hotel.name}
              </h2>
              <span className="text-sm font-semibold text-yellow-500">
                {hotel.category}
              </span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-white">
              {hotel.address}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-gray-600 dark:text-white">
                Phone: {hotel.phone}
              </p>
              <p className="text-gray-600 dark:text-white">
                Email: {hotel.email}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Amenities
              </h3>
              <ul className="flex flex-wrap gap-2 mt-2">
                {hotel.amenities.map((amenity) => (
                  <li
                    key={amenity.id}
                    className="flex items-center bg-gray-100 text-gray-800  text-sm font-medium px-3 py-1 rounded-full"
                    dangerouslySetInnerHTML={{
                      __html: `${amenity.amenity.icon} ${amenity.amenity.name}`,
                    }}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default FavoriteHotels;
