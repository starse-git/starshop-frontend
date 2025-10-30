"use client";
import TitleText from "@/components/app/TitleText";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import DplDailyComponent from "@/components/app/public/daily/DplDailyComponent";
import DplSpecialComponent from "@/components/app/public/special/DplSpecialComponent";
import ProductBoxWithoutBrandTitleComponent from "@/components/app/public/ProductBoxWithoutBrandTitleComponent";
import { useProductsByCategory } from "@/hooks/user/useProduct";
import { Product } from "@/types/products";

export default function DPLPage() {
  const { data: products } = useProductsByCategory("all", "2");
  return (
    <PublicDetailsLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
          D.PL Cell
        </h1>
        <p className="text-center text-sm md:text-base text-gray-700">
          乾燥やたるみ、年齢肌のゆらぎに悩むあなたへ ―{" "}
          <br className="md:hidden" />
          次世代エイジングケアとして肌の土台から整える
          <br className="md:hidden" />
          D.PL Cell（ディプルセル）。
          <br />
          自然由来成分と先端美容技術で、
          <br className="md:hidden" />
          ふっくら弾力のあるシルク肌へ導きます。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-10 md:my-24">
          {products?.data?.data?.slice(0, 4).map((item: Product) => (
            <ProductBoxWithoutBrandTitleComponent key={item.product_id}
            product={{
              id: item.product_id || 0,
              name: item.name,
              url: item.product_images?.[0].image_url || "",
              image: item.product_images?.[0].image_url || "",
              brand: {
                name: item.brand_id === 1 ? "exomere" : "dplcell",
              },
              rank: 0,
            }} />
          ))}
        </div>
        <div className="my-10">
          <TitleText
            title="HOW TO USE"
            subtitle="使い方"
            className="text-[#786464]"
          />
          <DplDailyComponent />
          <DplSpecialComponent />
        </div>
      </div>
    </PublicDetailsLayout>
  );
};