import { Suspense } from "react";
import AboutClientWrapper from "@/components/client/AboutClientWrapper";
import { Loader2 } from "lucide-react";

export default async function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="m-20 h-20 w-20 animate-spin" />
        </div>
      }
    >
      <div className="container py-12">
        <AboutClientWrapper />
      </div>
    </Suspense>
  );
}
