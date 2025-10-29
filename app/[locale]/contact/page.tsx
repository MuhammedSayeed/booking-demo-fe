import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/client/ContactForm";
import ContactContent from "@/components/client/ContactContent";
import FollowUs from "@/components/client/FollowUs";
import { Suspense } from "react";

export default async function ContactPage() {
  const tMain = await getTranslations();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="m-20 h-20 w-20 animate-spin" />
        </div>
      }
    >
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{tMain("Contact Us")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {tMain(
              "Have questions or need assistance? We're here to help Reach out to our team using the form below"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <ContactForm /> */}
          <FollowUs />
          <Card>
            <CardHeader>
              <CardTitle>{tMain("Contact Information")}</CardTitle>
              <CardDescription>
                {tMain(
                  "You can also reach us using the following contact details"
                )}
                .
              </CardDescription>
            </CardHeader>
            <ContactContent />
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
