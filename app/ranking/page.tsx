"use client";

import React, { useEffect, useState } from "react";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import { Product } from "@/types/products";
import ProductBoxComponent from "@/components/app/public/ProductBoxComponent";
import { useProductsByCategory } from "@/hooks/user/useProduct";
import { useBrands } from "@/hooks/useBrands";
import { cn } from "@/lib/utils";

const RankingPage = () => {
  const [brand, setBrand] = useState<string>("all");
  const [brandName, setBrandName] = useState<string>("all");

  const { data: brands } = useBrands();
  const { data: products } = useProductsByCategory("all", brand);

  const [brandTabs, setBrandTabs] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (brands) {
      setBrandTabs([
        ...brands?.data?.map((brand: { brand_id: number; name: string }) => ({
          value: brand.brand_id.toString(),
          label: brand.name,
        })),
        { value: "all", label: "All" },
      ]);
    }
  }, [brands]);
  return (
    <PublicDetailsLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
          RANKING
        </h1>
        <div className="w-full">
          {/* Tabs List */}
          <div className="flex flex-wrap justify-center mx-auto h-auto gap-4 md:gap-5 mb-4 md:mb-6">
            {brandTabs.map((tab) => (
              <button
                key={tab.value}
                value={tab.value}
                className={cn(
                  "group min-w-[100px] py-0 text-[#786464] font-semibold border-0 rounded-none shadow-none data-[state=active]:!shadow-none bg-transparent flex-none",
                  {
                    "border-b-2 border-[#786464]": brand === tab.value,
                  }
                )}
                onClick={() => {
                  setBrand(tab.value);
                  setBrandName(tab.label);
                }}
              >
                <span className="inline-block border-b-2 border-transparent group-data-[state=active]:border-[#786464]">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {products?.data?.data?.map((product: Product, index: number) => (
              <ProductBoxComponent
                key={product.product_id}
                product={{
                  id: product.product_id || 0,
                  name: product.name,
                  url: product.product_images?.[0].image_url || "",
                  image: product.product_images?.[0].image_url || "",
                  brand: {
                    name: brandName.toLowerCase() === "all" ? "" : brandName.toLowerCase().replace(" ", ""),
                  },
                  rank: index + 1,
                }}
                displayRank={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </PublicDetailsLayout>
  );
};

export default RankingPage;
