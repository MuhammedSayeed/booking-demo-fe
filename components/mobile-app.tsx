import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Apple, Play } from "lucide-react";

export function MobileApp() {
  return (
    <section className="py-12 md:py-16 bg-primary/5">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Download Our Mobile App
            </h2>
            <p className="text-muted-foreground mb-6">
              Get exclusive mobile-only deals, manage your bookings on the go,
              and receive real-time notifications about your stay.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Fast Booking</h3>
                  <p className="text-sm text-muted-foreground">
                    Book a room in less than 1 minute with our streamlined
                    process
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Secure Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Multiple secure payment options with instant confirmation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Exclusive Deals</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to mobile-only discounts and special promotions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">Download on the</span>
                  <span className="text-sm font-medium">App Store</span>
                </div>
              </Button>
              <Button className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">Get it on</span>
                  <span className="text-sm font-medium">Google Play</span>
                </div>
              </Button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative h-[400px] md:h-[500px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[560px]">
              <div className="relative h-full w-full">
                <Image
                  src="/placeholder.svg?height=560&width=280"
                  alt="Amr Booking Mobile App"
                  fill
                  className="object-cover rounded-[36px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
