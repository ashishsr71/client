import ProductList from "@/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string, search: string }>;
}) => {
  const category = (await searchParams).category;
  const search = (await searchParams).search;
  
  return (
    <div className="">
      <ProductList category={category} search={search} params="products"/>
    </div>
  );
};

export default ProductsPage;
