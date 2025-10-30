"use client";

import { toast } from "sonner";
import { ProductCell } from "./CartSectionOneComponent";
import { convertToYen, getPublicUrl } from "@/utils";
import { useGetCartItems } from "@/hooks/user/useCart";
import { useEffect, useState } from "react";
import { CartItem } from "@/types/cart";
import { Skeleton } from "@/components/ui/skeleton";
import Checkout from "./Checkout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CartSectionThreeComponent = ({
  billingAddressId,
  shippingAddressId,
  handleToPreviousStep,
}: {
  billingAddressId: number;
  shippingAddressId: number;
  handleToPreviousStep: () => void;
}) => {
  const { data: cartItems, isLoading, error, isError } = useGetCartItems();

  const [cart, setCart] = useState<CartItem>({} as CartItem);

  useEffect(() => {
    if (!cartItems?.data) return;
    setCart(cartItems?.data);
  }, [cartItems]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [error, isError]);

  return (
    <div className="flex gap-6 mt-10 md:flex-row flex-col">
      <div className="md:w-1/2 w-full space-y-4 rounded-md overflow-hidden border border-white-bg pb-6 bg-white md:px-6 md:py-10 px-3 py-0">
        {cart?.products?.length > 0 && (
          <Checkout cart={cart} billingAddressId={billingAddressId} shippingAddressId={shippingAddressId} />
        )}
      </div>

      <div className="md:w-1/2 w-full space-y-6">
        <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white">
          <div className="space-y-4">
            {!isLoading &&
              cart?.products?.map((product) => (
                <ProductCell
                  key={product.product_id}
                  name={product.product_name}
                  price={product.sale_price}
                  image={
                    product.product_images[0]
                      ? getPublicUrl(product.product_images[0])
                      : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  count={product.quantity}
                />
              ))}
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="w-full h-11 bg-white-bg" />
                <Skeleton className="w-full h-11 bg-white-bg" />
                <Skeleton className="w-full h-11 bg-white-bg" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm">小計</p>
              <p className="text-normal">
                {convertToYen(cart?.sub_total || 0)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">税金 (8%)</p>
              <p className="text-normal">
                {convertToYen(cart?.tax_eight || 0)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">税金 (10%)</p>
              <p className="text-normal">
                {convertToYen(cart?.tax_ten || 0)}
              </p>
            </div>
            {/* <div className="flex justify-between items-center">
                <p className="text-sm">ポイント</p>
                <p className="text-normal">{convertToYen(cart.point)}</p>
              </div> */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-xl">合計</p>
              <p className="font-semibold text-xl">
                {convertToYen(cart?.cart_total_price || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:justify-end justify-between space-x-4">
          <Button
            type="button"
            onClick={handleToPreviousStep}
            className="bg-white w-[100px] text-black hover:bg-white-bg cursor-pointer gap-1 border border-white-bg"
          >
            <ChevronLeft size={26} />
            <p>戻る</p>
          </Button>
          {/* <Button
            type="submit"
            className="bg-primary w-[100px] text-white hover:bg-primary/80 cursor-pointer gap-1"
          >
            <p>次へ</p>
            <ChevronRight size={26} />
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default CartSectionThreeComponent;
