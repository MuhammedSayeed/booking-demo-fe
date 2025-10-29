import ChainsCard from "./ChainsCard";
import ContentHeaderChains from "./ContentHeaderChains";

export function PopularDestinations() {
  return (
    <section className="container py-12 md:py-16">
      <ContentHeaderChains
        hText="Popular Chains"
        pText="Explore our most booked destinations around the world"
        btnText="View all chains"
        hrefLink="/chains"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChainsCard />
      </div>
    </section>
  );
}
