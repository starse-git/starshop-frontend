"use client"

import React, { useEffect, useState } from "react";
import SectionLayout from "@/components/layouts/SectionLayout";
import TitleText from "@/components/app/TitleText";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductBoxWithoutBrandTitleComponent from "../app/public/ProductBoxWithoutBrandTitleComponent";
import { Product } from "@/types/products";
import { useBrands } from "@/hooks/useBrands";
import { useProductsByCategory } from "@/hooks/user/useProduct";
import { cn } from "@/lib/utils";

//   {
//     id: 1,
//     name: "インフラポーション ローション",
//     image: image1,
//     rank: 0,
//     brand: { name: "EXOMERE" },
//   },
//   {
//     id: 2,
//     name: "アロマモイスト ミスト",
//     image: image2,
//     rank: 0,
//     brand: { name: "EXOMERE" },
//   },
//   {
//     id: 3,
//     name: "クリームミスト",
//     image: image3,
//     rank: 0,
//     brand: { name: "D.PLCell" },
//   },
//   {
//     id: 4,
//     name: "UV栄養クリーム",
//     image: image4,
//     rank: 0,
//     brand: { name: "D.PLCell" },
//   },
// ];
// const brandValueMap: Record<string, string> = {
//   exomere: "EXOMERE",
//   dplcell: "D.PLCell",
// };
const brandDescriptions: Record<string, React.ReactNode> = {
  exomere: (
    <>
      肌のハリやシワ、くすみに悩むあなたへ ― <br className="md:hidden" />
      年齢サインに本気で挑むEXOMERE（エクソミア）。 <br />
      針状の美容成分が奥深くまで届き、ターンオーバーをサポート。
      <br className="md:hidden" />
      肌の奥から引き締め、なめらかで弾力のある素肌へ導きます。
    </>
  ),
  dplcell: (
    <>
      乾燥やたるみ、年齢肌のゆらぎに悩むあなたへ ― <br className="md:hidden" />
      次世代エイジングケアとして肌の土台から整える
      <br className="md:hidden" />
      D.PL Cell（ディプルセル）。 <br />
      自然由来成分と先端美容技術で、
      <br className="md:hidden" />
      ふっくら弾力のあるシルク肌へ導きます。
    </>
  ),
  all: <>全ての商品一覧をご覧いただけます。</>,
};

const ProductsSectionComponent = () => {
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
    <>
      <SectionLayout className="my-14 md:my-28 h-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <TitleText
            title="Products"
            subtitle="商品一覧"
            className="text-[#786464]"
          />

          {/* Tabs List */}
          <div className="flex flex-wrap justify-center mx-auto h-auto gap-4 md:gap-5 mb-4 md:mb-6">
            {brandTabs.map((tab) => (
              <div
                key={tab.value}
                className={cn(
                  "group py-0 text-[#786464] font-semibold border-0 rounded-none shadow-none data-[state=active]:!shadow-none bg-transparent flex-none",
                  {
                    "border-b-2 border-[#786464]": brand === tab.value,
                  }
                )}
                onClick={() => {
                  setBrand(tab.value);
                  setBrandName(tab.label);
                }}
              >
                <span className="inline-block border-b-2 border-transparent group-data-[state=active]:border-[#786464] cursor-pointer">
                  {tab.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            {/* Brand Description */}
            <p className="text-center text-sm md:text-base text-gray-700 font-semibold">
              {
                brandDescriptions[
                  brandName
                    .toLowerCase()
                    .replace(" ", "") as keyof typeof brandDescriptions
                ]
              }
            </p>

            {/* Product List */}
            <div className="relative my-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-5">
                {products?.data?.data?.map((item: Product) => (
                  <ProductBoxWithoutBrandTitleComponent
                    key={item.product_id}
                    product={{
                      id: item.product_id || 0,
                      name: item.name,
                      image: item.product_images?.filter(
                        (image) => image.image_order === 0
                      )[0]?.image_url || "",
                      url: item.product_images?.filter(
                        (image) => image.image_order === 0
                      )[0]?.image_url || "",
                      brand: {
                        name:
                          brandName.toLowerCase() === "all"
                            ? ""
                            : brandName.toLowerCase().replace(" ", ""),
                      },
                    }}
                  />
                ))}
                {products?.data?.data?.length === 0 && (
                  <p className="text-sm md:text-base text-gray-700 font-semibold whitespace-nowrap">
                    このブランドの商品はまだありません。
                  </p>
                )}
              </div>

              {/* More Button */}
              {products?.data?.data?.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white via-white/70 to-transparent flex justify-center items-end">
                  <Button
                    variant="outline"
                    className="border-[#786464] rounded-none w-[150px] h-7 bg-white"
                  >
                    <Link
                      href={
                        brand === "all"
                          ? "/products"
                          : `/${brand === "dplcell" ? "dpl" : brand}`
                      }
                      className="text-[#786464] text-xs md:text-normal"
                    >
                      もっと見る
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionLayout>
    </>
  );
};

export default ProductsSectionComponent;
