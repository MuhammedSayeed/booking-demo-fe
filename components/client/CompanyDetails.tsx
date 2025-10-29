import { CompanyChain } from "@/interfaces/hotel";
import Image from "next/image";

export default function CompanyDetails({ t, chain }: { t: any; chain: CompanyChain}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
      <div>
        <h2 className="text-3xl font-bold mb-4">{t("Who We Are")}</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {chain.description}
        </p>
        <p className="text-muted-foreground mb-4">
          {t("Visit our website")}:{" "}
          <a
            href={chain.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {chain.website}
          </a>
        </p>
        <div className="flex gap-4 flex-wrap mt-4">
          {chain.facebook && (
            <a
              href={chain.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline"
            >
              {t("Facebook")}
            </a>
          )}
          {chain.instagram && (
            <a
              href={chain.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline"
            >
              {t("Instagram")}
            </a>
          )}
          {chain.email && (
            <a
              href={`mailto:${chain.email}`}
              className="text-sm text-muted-foreground underline"
            >
              {t("Email Us")}
            </a>
          )}
        </div>
      </div>

      <div className="relative h-[400px] rounded-lg overflow-hidden bg-muted">
        {chain.logo ? (
          <Image
            src={chain.logo}
            alt={`${chain.name} Logo`}
            fill
            className="object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            {t("No Logo")}
          </div>
        )}
      </div>
    </div>
  );
}
