"use client";

import TitleText from "@/components/app/TitleText";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import ExomereDailyComponent from "@/components/app/public/daily/ExomereDailyComponent";
import ExomereSpecialComponent from "@/components/app/public/special/ExomereSpecialComponent";
import ProductBoxWithoutBrandTitleComponent from "@/components/app/public/ProductBoxWithoutBrandTitleComponent";
import { useProductsByCategory } from "@/hooks/user/useProduct";
import { Product } from "@/types/products";

export default function ExomerePage() {
  const { data: products } = useProductsByCategory("all", "1");
  return (
    <PublicDetailsLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
          EXOMERE
        </h1>
        <p className="text-center text-sm md:text-base text-gray-700">
          肌のハリやシワ、くすみに悩むあなたへ ― <br className="md:hidden" />
          年齢サインに本気で挑むEXOMERE（エクソミア）。
          <br />
          針状の美容成分が奥深くまで届き、ターンオーバーをサポート。{" "}
          <br className="md:hidden" />
          肌の奥から引き締め、なめらかで弾力のある素肌へ導きます。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-10 md:my-24">
          {products?.data?.data?.slice(0, 4).map((item: Product) => (
            <ProductBoxWithoutBrandTitleComponent
              key={item.product_id}
              product={{
                id: item.product_id || 0,
                name: item.name,
                url: item.product_images?.[0].image_url || "",
                image: item.product_images?.[0].image_url || "",
                brand: {
                  name: item.brand_id === 1 ? "exomere" : "dplcell",
                },
                rank: 0,
              }}
            />
          ))}
        </div>
        <div className="my-10">
          <TitleText
            title="HOW TO USE"
            subtitle="使い方"
            className="text-[#786464]"
          />
          <ExomereDailyComponent />
          <ExomereSpecialComponent />
        </div>
      </div>
    </PublicDetailsLayout>
  );
};