import ProductList from "@/components/ProductList";
import HeroBanner from "@/components/HeroBanner";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string, search: string }>;
}) => {
  const category = (await searchParams).category;
  const search = (await searchParams).search;
  
  return (
    <div className="">
      <HeroBanner />
      <ProductList category={category} search={search} params="homepage"/>
    </div>
  );
};

export default Homepage;
