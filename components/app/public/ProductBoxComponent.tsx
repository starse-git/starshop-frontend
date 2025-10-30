"use client";

import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { RankingNewArrivalType } from '@/types/products';
import brandExomereTtl from "@/public/products/brandExomereTtl.png";
import brandDplcellTtl from "@/public/products/brandDplcellTtl.png";
import { encryptString, getPublicUrl } from '@/utils';
import { useRouter } from 'next/navigation';

type ProductBoxProps = {
  product: RankingNewArrivalType;
  displayRank?: number;
};

const ProductBoxComponent = ({ product, displayRank }: ProductBoxProps) => {
  const router = useRouter();
  const brandLogo =
    product.brand?.name === "exomere"
      ? brandExomereTtl
      : product.brand?.name === "dplcell"
      ? brandDplcellTtl
      : undefined;
    const rankColors = ["bg-[#c7b27e]", "bg-[#b3b3b3]", "bg-[#c29075]", "bg-[#f17e7d]"];
    const rankBg = displayRank
    ? rankColors[(displayRank - 1) % rankColors.length]
    : "bg-gray-400";
  return (
    <>
      <div
        className={cn(
          "w-full flex items-center justify-start flex-col bg-[#f0efea] p-4 gap-1 md:gap-2 cursor-pointer relative"
        )}
        onClick={() => router.push(`/products/${encryptString(product.id.toString())}`)}
      >
        {/* Ranking Badge */}
        {product.rank! > 0 && (
        // {displayRank && (
          <div
            className={cn(
              "absolute -top-2 -left-2 text-white text-2xl font-bold font-cormorant rounded-full w-10 h-10 flex items-center justify-center",
              rankBg
            )}
          > 
            {displayRank}
          </div>
        )}
        {brandLogo && (
          <div className="w-full h-5 flex items-center justify-center">
            <Image
              src={brandLogo}
              alt={product.brand?.name || "brand"}
              className="h-full w-auto object-contain"
            />
          </div>
        )}
        <div className="w-full h-[150px] md:h-[200px]">
          <Image
            src={getPublicUrl(product.url || "")}
            alt={product.name}
            className="w-full h-full object-contain"
            width={200}
            height={200}
          />
        </div>
        <p
          className={cn(
            "text-center font-noto text-xs",
            product.brand?.name === "exomere"
              ? "text-[#f17e7d]"
              : product.brand?.name === "dplcell"
                ? "text-[#723a5a]"
                : "text-dark"
          )}
        >
          {product.name}
        </p>
      </div>
    </>
  );
}

export default ProductBoxComponent;
