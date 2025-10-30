"use client"

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RankingNewArrivalType } from "@/types/products";
import { encryptString, getPublicUrl } from "@/utils";
import { useRouter } from "next/navigation";

type ProductBoxWithoutBrandProps = {
  product: RankingNewArrivalType;
};

const ProductBoxWithoutBrandTitleComponent = ({
  product,
}: ProductBoxWithoutBrandProps) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "w-full flex items-center justify-start flex-col bg-[#f0efea] p-4 gap-1 md:gap-2 cursor-pointer relative"
      )}
      onClick={() => router.push(`/products/${encryptString(product.id.toString())}`)}
    >
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
  );
};

export default ProductBoxWithoutBrandTitleComponent;
