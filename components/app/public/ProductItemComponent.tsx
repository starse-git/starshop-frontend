"use client"

import productType from "@/types/products";
import Image from "next/image";
import { convertToYen, encryptString } from "@/utils";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ProductItemComponent = ({ product }: { product: productType }) => {
  const router = useRouter();
  const { name, price, image, isTax, imgBg } = product;
  return (
    <div
      onClick={() => router.push(`/products/${encryptString(product.id.toString())}`)}
      className={cn("text-center flex-col-center gap-4 cursor-pointer bg-white/50", !imgBg && "border border-white-bg")}
    >
      <div className={cn("w-full h-[300px] bg-white-bg bg-contain flex items-center justify-center border border-[0.5px] border-gray-200", imgBg && "bg-white-bg")}>
        <Image src={image} alt={name} className="w-full h-full object-contain" width={300} height={300} />
      </div>
      <div className="flex-col-center gap-2 py-10">
        <p className="text-normal">{name}</p>
        <div className="flex-row-center gap-1">
          <span className="text-price">{convertToYen(price)}</span>{" "}
          <span className="text-small">{isTax ? "[税込]" : "[税抜]"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItemComponent;
