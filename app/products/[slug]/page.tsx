"use client";

import BadgeComponent from "@/components/app/public/BadgeComponent";
import CounterComponent from "@/components/app/public/CounterComponent";
import TitleWithUnderlineDecorationComponent from "@/components/app/public/TitleWithUnderlineDecorationComponent";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ProductItemComponent from "@/components/app/public/ProductItemComponent";
import ProductPhotoGallery from "@/components/profile/ProductPhotoGallery";
import { useProductDetail } from "@/hooks/user/useProduct";
import { useParams } from "next/navigation";
import { Product, ProductRecommendationResponse } from "@/types/products";
import {
  convertToYen,
  decryptString,
  getPublicUrl,
  priceWithTax,
} from "@/utils";
import { useAddToCart } from "@/hooks/user/useCart";
import { toast } from "sonner";
import { useGetRecommendProducts } from "@/hooks/user/useRecommendProduct";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { useUser } from "@/hooks/useUser";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams(); // Get params
  const { mutate: addToCart, isPending: addToCartPending } = useAddToCart(); // Add to cart
  const { isLoggedIn } = useUser(); // Is logged in

  const [productId, setProductId] = useState<number>(); // Product ID
  const [product, setProduct] = useState<
    Product & { category: { name: string } } & {
      product_images: { image_url: string }[];
      brand: { name: string };
    }
  >(); // Product
  const [recommendProduct, setRecommendProduct] =
    useState<ProductRecommendationResponse[]>(); // Recommend product

  const [regularPercentage, setRegularPercentage] = useState<string>("0"); // Regular percentage

  const [count, setCount] = useState(1); // Count

  // Get product detail
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
    isError: productIsError,
  } = useProductDetail(productId || 0);

  const { data: recommendProductData, isLoading: recommendProductLoading } =
    useGetRecommendProducts(productId || 0);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("ログインしてください");
      return;
    }
    if (regularPercentage !== "0") {
      router.push(`/subscription/${params.slug}`);
      return;
    }
    addToCart(
      {
        productId: productId || 0,
        quantity: count,
      },
      {
        onSuccess: () => {
          toast.success("商品をカートに入れました");
        },
        onError: () => {
          toast.error("商品をカートに入れませんでした");
        },
      }
    );
  };

  // Set product
  useEffect(() => {
    if (productData) {
      setProduct(productData.data[0]);
    }
  }, [productData]);

  // Set recommend product
  useEffect(() => {
    if (recommendProductData) {
      setRecommendProduct(recommendProductData.data);
    }
  }, [recommendProductData]);

  // Set product ID
  useEffect(() => {
    if (params.slug) {
      const productId = decryptString(params.slug as string);
      setProductId(Number(productId));
    }
  }, [params.slug]);

  // Set product error
  useEffect(() => {
    if (productIsError) {
      const error = productError as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message);
    }
  }, [productIsError, productError]);

  return (
    <PublicDetailsLayout>
      <div className="px-4 flex flex-col md:flex-row md:gap-10">
        {!productLoading && product?.product_images && (
          <ProductPhotoGallery
            products={product?.product_images
              .slice()
              .sort((a, b) => (a.image_order || 0) - (b.image_order || 0))
              .map((image, index) => ({
                id: index,
                name: product?.name,
                image: image.image_url
                  ? getPublicUrl(image.image_url)
                  : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }))}
          />
        )}
        {productLoading && (
          <Skeleton className="w-full md:w-[70%] h-[500px] bg-white-bg border border-black/10" />
        )}

        {product && (
          <div className="w-full md:w-[30%] md:mt-0 mt-5">
            <div className="space-y-4">
              <BadgeComponent
                label={product?.stock_quantity > 0 ? "在庫あり" : "在庫なし"}
              />

              <p className="text-normal">{product?.name}</p>
            </div>
            <div className="flex items-center mt-4 space-x-2">
              <p className="text-sm font-bold">ブランド:</p>
              <p className="text-sm">{product?.brand?.name}</p>
            </div>

            <div className="my-6 md:my-10">
              <p className="text-price">
                {convertToYen(
                  regularPercentage === "0"
                    ? priceWithTax(product?.sale_price, product?.tax)
                    : product?.regular_discount
                )}
                <span className="text-normal">[税込]</span>
              </p>
            </div>

            <div className="mt-6 mb-2 md:mt-10 md:mb-4">
              <RadioGroup
                value={regularPercentage ?? "0"}
                onValueChange={setRegularPercentage}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="option-one" />
                  <Label htmlFor="option-one">今回のみのご購入</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={product?.regular_percentage?.toString() ?? "1"}
                    id="option-two"
                  />
                  <Label htmlFor="option-two">
                    定期購入（{product?.regular_percentage}%割引）
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {regularPercentage === "0" && (
              <div>
                <CounterComponent
                  min={1}
                  max={product?.stock_quantity}
                  count={count}
                  setCount={setCount}
                />
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              className="w-full rounded-none bg-black hover:bg-black/80 text-xs text-white mt-4 cursor-pointer"
              disabled={addToCartPending}
            >
              {addToCartPending
                ? "追加中..."
                : regularPercentage === "0"
                  ? "カートに入れる"
                  : "定期購入を開始する"}
            </Button>

            <div className="mt-10 space-y-4">
              <TitleWithUnderlineDecorationComponent title="概要" />

              <div className="prose max-w-none [&_h3]:mt-6 [&_h3]:mb-2 [&_h4]:mt-4 [&_h4]:mb-2 [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2">
                <div
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                />
              </div>
            </div>
          </div>
        )}
        {productLoading && (
          <Skeleton className="w-full md:w-[30%] h-[500px] bg-white-bg border border-black/10" />
        )}
      </div>

      <div className="mt-10 space-y-10 md:mt-20 px-4 md:px-6 lg:px-8">
        <div className="text-left">
          <span
            className="text-5xl font-allura"
            style={{ fontFamily: "Allura, cursive" }}
          >
            Recommend
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendProductLoading ||
            (recommendProduct &&
              recommendProduct?.length > 0 &&
              recommendProduct?.map((product) => (
                <ProductItemComponent
                  key={product.recommended_product.product_id}
                  product={{
                    id: product.recommended_product.product_id,
                    name: product.recommended_product.name,
                    price: Math.floor(
                      product.recommended_product.sale_price +
                        (product.recommended_product.sale_price *
                          product.recommended_product.tax) /
                          100
                    ),
                    image: product.recommended_product.product_images
                      .filter(
                        (image) => image.image_order === 0
                      )[0]?.image_url
                      ? getPublicUrl(
                          product.recommended_product.product_images
                            .filter(
                              (image) => image.image_order === 0
                            )[0]?.image_url
                        )
                      : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    isTax: true,
                    imgBg: true,
                  }}
                />
              )))}
          {recommendProductLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-64 bg-white-bg border border-black/10"
              />
            ))}
          {(!recommendProductLoading && !recommendProduct) ||
            (recommendProduct?.length === 0 && <p>おすすめ商品がありません</p>)}
        </div>
      </div>
    </PublicDetailsLayout>
  );
};

export default ProductDetailPage;
