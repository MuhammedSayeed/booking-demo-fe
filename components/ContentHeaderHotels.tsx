"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
function ContentHeaderHotels() {
  const tMain = useTranslations();
  const { locale } = useParams();
  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          {tMain("Featured Hotels")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {tMain("Discover our handpicked selection of exceptional hotels")}
        </p>
      </div>
      <Button asChild variant="outline" className="mt-4 md:mt-0">
        <Link href="/hotels">{tMain("View all hotels")}</Link>
      </Button>
    </div>
  );
}

export default ContentHeaderHotels;
