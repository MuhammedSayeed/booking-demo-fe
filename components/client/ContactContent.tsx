"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

function ContactContent() {
  const chain = useSelector((state: RootState) => state.chainSlice);
  const t = useTranslations();
  return (
    <CardContent className="space-y-6">
      {chain.email && (
        <div className="flex items-start space-x-4">
          <Mail className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">{t("Email")}</h3>
            <p className="text-sm text-muted-foreground">{chain.email}</p>
          </div>
        </div>
      )}

      {chain.phone_number && (
        <div className="flex items-start space-x-4">
          <Phone className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">{t("Phone")}</h3>
            <p className="text-sm text-muted-foreground">
              {chain.phone_number}
            </p>
            <p className="text-sm text-muted-foreground">
              {chain.whatsapp_number}
            </p>
          </div>
        </div>
      )}
    </CardContent>
  );
}

export default ContactContent;
