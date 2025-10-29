"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import HeroSection from "./HeroSection";
import CompanyDetails from "./CompanyDetails";
import ContactInfo from "./ContactInfo";
import CTA from "./CTA";
import { Separator } from "@/components/ui/separator";

export default function AboutClientWrapper() {
  const chain = useSelector((state: RootState) => state.chainSlice);
  const { locale } = useParams();
  const t = useTranslations();

  if (chain.id === -1) return null;

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      <HeroSection t={t} chain={chain} />
      <CompanyDetails t={t} chain={chain} />
      <ContactInfo t={t} chain={chain} />
      <Separator className="my-16" />
      <CTA t={t} chain={chain} />
    </div>
  );
}
