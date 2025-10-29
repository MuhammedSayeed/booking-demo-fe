
'use client'
import { FeaturedHotels } from "@/components/featured-hotels";
import { HeroSlider } from "@/components/hero-slider";
import HeroSearchForm from "@/components/client/HeroSearchForm"; 
import { useThemeData } from "@/context/theme-context";

export default function HomePage() {

  const theme = useThemeData();

  return (
    <main className="flex-1">
      <section className="relative h-[95vh] w-full">
        <HeroSlider images={theme.background_images as []}>
          <HeroSearchForm />
        </HeroSlider>
      </section>
      <FeaturedHotels />

      {/* <FavoriteHotelsSection /> */}

      {/* <RoomsView /> */}
    </main>
  );
}
