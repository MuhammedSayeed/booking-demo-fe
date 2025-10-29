import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyChain } from "@/interfaces/hotel";

export default function CTA({ t, chain }: { t: any; chain: CompanyChain }) {
  return (
    <div className="bg-muted rounded-lg p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">{t("Connect With Us")}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
        {t(
          "Have questions or want to work with us? Get in touch we’d love to hear from you"
        )}
        .
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/contact">{t("Contact Page")}</Link>
        </Button>
        {chain.website && (
          <Button
            asChild
            className="bg-primary  text-white"
          >
            <Link href={chain.website} target="_blank">
              {t("Visit Website")}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
