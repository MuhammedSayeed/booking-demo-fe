import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "My stay at the Grand Plaza Hotel was absolutely perfect! The staff went above and beyond to make my anniversary special. The room had an amazing view and the restaurant served the best food I've had in years.",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Toronto, Canada",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Amr Booking made booking my business trip so easy. The app was intuitive, and when I needed to modify my reservation, customer service was prompt and helpful. Will definitely use this platform for all my future travels.",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "London, UK",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
      text: "I've used many hotel booking platforms, but Amr Booking offers the best deals and most transparent pricing. No hidden fees or surprises at checkout. The loyalty program is also quite generous compared to competitors.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-primary">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why thousands of travelers choose Amr Booking for their
            accommodation needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground flex-grow">
                  {testimonial.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
