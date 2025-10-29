import { CompanyChain } from "@/interfaces/hotel";

export default function HeroSection({
  t,
  chain,
}: {
  t: any;
  chain: CompanyChain;
}) {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold mb-4">
        {t("About")} {chain.name}
      </h1>
      <p className="text-muted-foreground mb-4">
        {t("Based in")} <strong>{chain.headquarters}</strong>
        {t(
          "were dedicated to offering the best hospitality and travel experiences"
        )}
        .
      </p>
    </div>
  );
}
