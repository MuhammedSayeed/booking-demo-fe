"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
function ContentHeaderChains({
  hText,
  pText,
  btnText,
  hrefLink,
}: {
  hrefLink: string;
  hText: string;
  pText: string;
  btnText: string;
}) {
  const tMain = useTranslations();
  const { locale } = useParams();
  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          {tMain(hText)}
        </h2>
        <p className="text-muted-foreground mt-2">
          {tMain(pText)}
        </p>
      </div>
      <Button asChild variant="outline" className="mt-4 md:mt-0">
        <Link href={ hrefLink}>{tMain(btnText)}</Link>
      </Button>
    </div>
  );
}

export default ContentHeaderChains;
