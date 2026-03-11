"use client";

import { useEffect, useState } from "react";
import { ProductsType } from "@/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import { api } from "@/services/api";
import { useSearchParams } from "next/navigation";

const ProductList = ({ category, search, params }: { category?: string, search?: string, params: "homepage" | "products" }) => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductsType>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construct API query from current URL search params
        const query = new URLSearchParams(searchParams.toString());
        if (category && !query.has("category")) {
          query.set("category", category);
        }
        if (search && !query.has("search")) {
          query.set("search", search);
        }
        
        const data = await api.getProducts(query);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, searchParams]);

  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter/>}
      
      {loading ? (
        <div className="flex justify-center p-12">
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Link
        href={category ? `/products/?category=${category}` : "/products"}
        className="flex justify-end mt-4 underline text-sm text-gray-500"
      >
        View all products
      </Link>
    </div>
  );
};

export default ProductList;
