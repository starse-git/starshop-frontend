"use client"

import React from "react";
import SectionLayout from "@/components/layouts/SectionLayout";
import TitleText from "@/components/app/TitleText";
import ProductBoxComponent from "../app/public/ProductBoxComponent";
import ButtonLink from "@/components/app/ButtonLink";
import { useProductsByCategory } from "@/hooks/user/useProduct";
import { Product } from "@/types/products";

const NewArrivalSectionComponent = () => {
  const { data: products } = useProductsByCategory("all", "all");
  return (
    <>
      <SectionLayout className="my-14 md:my-28 h-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative">
            <TitleText
              title="New Arrival"
              subtitle="新着商品"
              className="text-[#786464]"
            />
            <div className="absolute top-3 right-0 hidden md:block">
              <ButtonLink href="/newarrival" className="">
                もっと見る
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products?.data?.data?.slice(0, 4).map((item: Product) => (
              <ProductBoxComponent
                key={item.product_id}
                product={{
                  id: item.product_id || 0,
                  name: item.name,
                  url: item.product_images?.filter(
                    (image) => image.image_order === 0
                  )[0]?.image_url || "",
                  image: item.product_images?.filter(
                    (image) => image.image_order === 0
                  )[0]?.image_url || "",
                  brand: item.brand,
                  rank: 0,
                }}
              />
            ))}
          </div>
          <div className="block md:hidden text-right mt-5">
            <ButtonLink href="/newarrival" className="">
              もっと見る
            </ButtonLink>
          </div>
        </div>
      </SectionLayout>
    </>
  );
};

export default NewArrivalSectionComponent;
