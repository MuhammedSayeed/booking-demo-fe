"use client";
import { useEffect, useState } from "react";
import FavoriteHotels from "@/components/FavoriteHotels";
import { useTranslations } from "next-intl";

export default function FavoriteHotelsSection() {
  const [favoriteHotels, setFavoriteHotels] = useState<string[]>([]);
  const t = useTranslations();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFavoriteHotels(
        JSON.parse(localStorage.getItem("favoriteHotels") || "[]")
      );
    }
  }, []);

  if (favoriteHotels.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("Your Favorite Hotels")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteHotels?.slice(0, 6).map((id) => (
            <FavoriteHotels key={id} favoriteHotels={`${id}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
