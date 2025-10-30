"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CounterComponent from "@/components/app/public/CounterComponent";
import { convertToYen, encryptString, getPublicUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useDeleteCartItem,
  useGetCartItems,
  useUpdateCartItemQuantity,
} from "@/hooks/user/useCart";
import { CartItem, CartProduct } from "@/types/cart";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const ProductCell = ({
  name,
  price,
  image,
  isTax,
  count,
  onClick,
}: {
  name: string;
  price: number;
  image: string;
  isTax?: boolean;
  count?: number;
  onClick?: () => void;
}) => {
  return (
    <div className="flex gap-4 items-center cursor-pointer" onClick={onClick}>
      <div className="w-[80px] h-[80px] bg-white-bg border border-black/10">
        <Image
          src={image}
          alt={name || ""}
          className="w-full h-full object-contain"
          width={80}
          height={80}
        />
      </div>
      <div className="space-y-2">
        <p className="text-normal">{name || ""}</p>
        <p className="text-normal">
          {convertToYen(price)} {isTax && "[税込]"} {count && `* ${count}`}
        </p>
      </div>
    </div>
  );
};

// Desktop
const ProductRow = ({
  product,
  handleToCalculateTotalPrice,
}: {
  product: CartProduct;
  handleToCalculateTotalPrice: (
    productId: number,
    quantity: number,
    tax: number
  ) => void;
}) => {
  const router = useRouter(); // Router
  const [count, setCount] = useState<number>(0); // Count
  const { mutate: updateCartItemQuantity } = useUpdateCartItemQuantity(); // Update cart item quantity
  const { mutate: deleteCartItem } = useDeleteCartItem(); // Delete cart item

  useEffect(() => {
    setCount(product.quantity);
  }, [product.quantity]);

  return (
    <TableRow key={product.product_id} className="border-b border-white-bg">
      <TableCell className="md:px-6 px-3 md:py-4 py-4">
        <ProductCell
          name={product.product_name}
          price={product.sale_price}
          image={
            product.product_images[0]
              ? getPublicUrl(product.product_images[0])
              : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          onClick={() => router.push(`/products/${encryptString(product.product_id.toString())}`)}
        />
      </TableCell>
      <TableCell className="px-6 py-4">
        {convertToYen(product.sale_price)}
      </TableCell>
      <TableCell className="px-6 py-4">
        <CounterComponent
          max={product.stock_quantity}
          min={product.safe_stock_quantity}
          count={count}
          setCount={setCount}
          handleToClick={(quantity) => {
            handleToCalculateTotalPrice(
              product.product_id,
              quantity,
              product.tax
            );
            if (quantity === 0) {
              deleteCartItem(
                {
                  cartItemId: product.cart_item_id,
                  productId: product.product_id,
                },
                {
                  onError: (error) => {
                    toast.error(error.message);
                  },
                }
              );
            } else {
              updateCartItemQuantity(
                {
                  cartItemId: product.cart_item_id,
                  productId: product.product_id,
                  quantity,
                },
                {
                  onError: (error) => {
                    toast.error(error.message);
                  },
                }
              );
            }
          }}
        />
      </TableCell>
      <TableCell className="text-right px-6 py-4">
        {convertToYen(product.total)}
      </TableCell>
    </TableRow>
  );
};

// Mobile
const ProductRowMobile = ({
  product,
  handleToCalculateTotalPrice,
}: {
  product: CartProduct;
  handleToCalculateTotalPrice: (
    productId: number,
    quantity: number,
    tax: number
  ) => void;
}) => {
  const router = useRouter(); // Router
  const [count, setCount] = useState<number>(0); // Count
  const { mutate: updateCartItemQuantity } = useUpdateCartItemQuantity(); // Update cart item quantity
  const { mutate: deleteCartItem } = useDeleteCartItem(); // Delete cart item

  useEffect(() => {
    setCount(product.quantity);
  }, [product.quantity]);

  return (
    <div key={product.product_id} className="border-b border-white-bg">
      <div className="md:px-6 px-3 md:py-4 py-4">
        <ProductCell
          name={product.product_name}
          price={product.sale_price}
          image={
            product.product_images[0]
              ? getPublicUrl(product.product_images[0])
              : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          onClick={() => router.push(`/products/${encryptString(product.product_id.toString())}`)}
        />
      </div>
      <div className="px-3 py-2 mb-2 flex items-center justify-between">
        <CounterComponent
          max={product.stock_quantity}
          min={product.safe_stock_quantity}
          count={count}
          setCount={setCount}
          handleToClick={(quantity) => {
            handleToCalculateTotalPrice(
              product.product_id,
              quantity,
              product.tax
            );
            if (quantity === 0) {
              deleteCartItem(
                {
                  cartItemId: product.cart_item_id,
                  productId: product.product_id,
                },
                {
                  onError: (error) => {
                    toast.error(error.message);
                  },
                }
              );
            } else {
              updateCartItemQuantity(
                {
                  cartItemId: product.cart_item_id,
                  productId: product.product_id,
                  quantity,
                },
                {
                  onError: (error) => {
                    toast.error(error.message);
                  },
                }
              );
            }
          }}
        />
        <div className="text-right">
          {convertToYen(product.total)}
        </div>
      </div>
    </div>
  );
};

const CartSectionOneComponent = ({
  handleToUpdateCart,
}: {
  handleToUpdateCart: () => void;
}) => {
  // Get cart items
  const { data: cartItems, isLoading, error, isError } = useGetCartItems();
  const [cart, setCart] = useState<CartItem>({} as CartItem); // Cart items
  const [disableNextButton, setDisableNextButton] = useState<boolean>(false);

  // Handle to calculate total price
  const handleToCalculateTotalPrice = (
    productId: number,
    quantity: number,
    tax: number
  ) => {
    const { products, user_id, cart_id, cart_item_id } = cart;

    const cartItem = products.find((item) => item.product_id === productId);
    if (!cartItem) return;

    // Update the specific item
    cartItem.quantity = quantity;
    cartItem.total = cartItem.sale_price * quantity;
    cartItem.tax = tax;

    // Recalculate entire cart from scratch to avoid cumulative errors
    let subTotal = 0;
    let taxEight = 0;
    let taxTen = 0;

    products.forEach((item) => {
      subTotal += item.total;

      // Calculate tax per unit and multiply by quantity to avoid rounding issues
      const taxPerUnit = Math.floor((item.sale_price * item.tax) / 100);
      const taxAmount = taxPerUnit * item.quantity;

      if (item.tax === 8) {
        taxEight += taxAmount;
      } else if (item.tax === 10) {
        taxTen += taxAmount;
      }
    });

    const cartTotalPrice = subTotal + taxEight + taxTen;

    setCart({
      sub_total: subTotal,
      tax_eight: taxEight,
      tax_ten: taxTen,
      cart_total_price: cartTotalPrice,
      products,
      user_id,
      cart_id,
      cart_item_id,
    });

    if (cartTotalPrice === 0) {
      setDisableNextButton(true);
    } else {
      setDisableNextButton(false);
    }
  };

  // Set cart items
  useEffect(() => {
    if (!cartItems?.data) return;
    setCart(cartItems?.data);
  }, [cartItems]);

  // If error, show error message
  useEffect(() => {
    if (isError) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err?.response?.data?.message);
    }
  }, [isError, error]);

  return (
    <>
      <div className="mt-10 border border-white-bg rounded-md bg-white">

        {/* Desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="">
              <TableRow className="border-b border-white-bg">
                <TableHead className="md:w-[200px] w-[100px] md:px-6 px-3 md:py-4 py-2">商品</TableHead>
                <TableHead className="md:w-[100px] w-[50px] md:px-6 px-3 md:py-4 py-2">価格（税抜）</TableHead>
                <TableHead className="md:w-[200px] w-[100px] md:px-6 px-3 md:py-4 py-2">個数</TableHead>
                <TableHead className="md:w-[150px] w-[100px] text-right md:px-6 px-3 md:py-4 py-2">合計金額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                cart?.products
                  ?.filter((product) => product.quantity > 0)
                  .map((product) => (
                    <ProductRow
                      key={product.product_id}
                      product={product}
                      handleToCalculateTotalPrice={handleToCalculateTotalPrice}
                    />
                  ))}
              {/* 読み込み中。。。 */}
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-white-bg">
                    <TableCell colSpan={4} className="h-16">
                      <Skeleton className="h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
              {/* Empty cart */}
              {(!isLoading && cart?.products?.length === 0) ||
                (cart?.products?.length === undefined && (
                  <TableRow key={"empty"} className="border-b border-white-bg">
                    <TableCell colSpan={4} className="h-16" align="center">
                      <p>カートに商品がありません</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {/* 商品表示 */}
          {!isLoading &&
            cart?.products
              ?.filter((product) => product.quantity > 0)
              .map((product) => (
                <ProductRowMobile
                  key={product.product_id}
                  product={product}
                  handleToCalculateTotalPrice={handleToCalculateTotalPrice}
                />
              ))}
          {/* 読み込み中。。。 */}
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-b border-white-bg">
                <Skeleton className="h-full bg-white-bg" />
              </div>
            ))}
          {/* Empty cart */}
          {(!isLoading && cart?.products?.length === 0) ||
            (cart?.products?.length === undefined && (
              <div key={"empty"} className="border-b border-white-bg p-4 text-center">
                <p>カートに商品がありません</p>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4 border border-white-bg rounded-md md:px-6 px-4 md:py-10 py-8 md:space-y-10 space-y-6 bg-white">
        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>小計</p>
          </div>
          <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>{convertToYen(cart?.sub_total || 0)}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>税金 (8%)</p>
          </div>
          <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>{convertToYen(cart?.tax_eight || 0)}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>税金 (10%)</p>
          </div>
          <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
            <p>{convertToYen(cart?.tax_ten || 0)}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="md:w-[70%] flex justify-end font-semibold text-2xl">
            <p>合計</p>
          </div>
          <div className="md:w-[30%] flex justify-end font-semibold text-2xl">
            <p>{convertToYen(cart?.cart_total_price || 0)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end md:mt-10 mt-6">
        <Button
          onClick={() => {
            if (cartItems?.data?.length === 0) return;
            handleToUpdateCart();
          }}
          disabled={cartItems?.data?.length === 0 || cart?.products?.length === undefined || disableNextButton}
          className="flex-row-center gap-1 text-white w-[100px] cursor-pointer"
        >
          <p>次へ</p>
          <ChevronRight size={26} />
        </Button>
      </div>
    </>
  );
};

export default CartSectionOneComponent;
