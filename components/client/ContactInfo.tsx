import { Card, CardContent } from "@/components/ui/card";
import { CompanyChain } from "@/interfaces/hotel";

export default function ContactInfo({ t, chain }: { t: any; chain: CompanyChain}) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("Contact Information")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t("Phone")}</h3>
            <p className="text-muted-foreground">
              {chain.phone_number || "N/A"}
            </p>
            <p className="text-muted-foreground">
              {chain.mobile_number || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t("WhatsApp")}</h3>
            <p className="text-muted-foreground">
              {chain.whatsapp_number || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t("Email")}</h3>
            <p className="text-muted-foreground">{chain.email || "N/A"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
