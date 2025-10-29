"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

interface HeroSliderProps {
  images: {
    url: string;
  }[],
  interval?: number
  children?: React.ReactNode
}

export function HeroSlider({ images, interval = 5000, children }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToNext = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }, [images.length])

  // Auto-advance the slider
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext()
    }, interval)

    return () => clearInterval(timer)
  }, [goToNext, interval])

  // Pause auto-advance when user interacts with controls
  const handleManualNavigation = (direction: "next" | "prev") => {
    if (isTransitioning) return
    if (direction === "next") {
      goToNext()
    } else {
      goToPrevious()
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.url || "/placeholder.svg"}
            alt={`Hero image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover brightness-75 blur-[1px]"
          />
          <div className="relative h-full w-full bg-[#1f1b1776]"></div>
        </div>
      ))}


      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
