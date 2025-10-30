'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProductsByCategory } from '@/hooks/user/useProduct';
import { useCategory } from '@/hooks/useCategory';
import { useBrands } from '@/hooks/useBrands';
import { BrandList } from '@/types/brands';
import { Category } from '@/types/categories';
import { Skeleton } from '@/components/ui/skeleton';
import BannerComponent from '@/components/app/BannerComponent';
import ProductItemComponent from '@/components/app/public/ProductItemComponent';
import TitleWithNavigationComponent from '@/components/app/public/TitleWithNavigationComponent';
import BannerImage from '@/public/products/Banner.png';
import ProductsImage from '@/public/svgs/text/Products.svg';
import { getPublicUrl } from '@/utils';
import { toast } from 'sonner';
import { Product } from "@/types/products";

export default function ProductPageWrapper() {
  const params = useSearchParams(); // Get search parameters
  const router = useRouter(); // Router for navigation

  const [selectedOption, setSelectedOption] = useState('all'); // Selected option for category
  const [selectedBrand, setSelectedBrand] = useState('all'); // Selected brand

  // Custom hook to fetch product data
  const {
    data: serverProducts,
    isLoading,
    error,
    isError,
  } = useProductsByCategory(selectedOption, selectedBrand);

  // Custom hook to fetch category data
  const { data: categories } = useCategory();

  // Custom hook to fetch brand data
  const { data: brands } = useBrands();

  // Handle select brand
  const handleToSelectBrand = (value: string, name: string) => {
    setSelectedBrand(value);
    router.push(`/products?brand=${name}`);
  };

  // Handle select option
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }
  }, [isError, error]);

  // Handle select brand
  useEffect(() => {
    const paramBrand = params.get('brand');
    if (brands?.data && paramBrand) {
      const filteredBrandId = brands.data.find(
        (brand: BrandList) => brand.name === paramBrand
      );
      setSelectedBrand(filteredBrandId?.brand_id.toString() || 'all');
    }
  }, [params, brands]);

  return (
    <>
      <BannerComponent image={BannerImage} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 space-y-10">
        <TitleWithNavigationComponent
          title="Products"
          titleImage={ProductsImage}
          options={categories?.data?.data?.map((category: Category) => ({
            label: category.name,
            value: category.category_id.toString(),
          }))}
          selectedOption={selectedOption}
          handleToSelect={(value) => setSelectedOption(value)}
          selectedBrand={selectedBrand}
          handleToSelectBrand={(value, name) =>
            handleToSelectBrand(value, name)
          }
          brands={brands?.data?.map((brand: BrandList) => ({
            label: brand.name,
            value: brand.brand_id.toString(),
          }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {!isLoading &&
            serverProducts?.data?.data.map((product: Product) => (
              <ProductItemComponent
                key={product.product_id}
                product={{
                  id: product.product_id || 0,
                  name: product.name,
                  price: product.tax
                    ? product.sale_price +
                      (product.sale_price * product.tax) / 100
                    : product.sale_price,
                  image: product.product_images?.filter(
                    (image) => image.image_order === 0
                  )[0]?.image_url
                    ? getPublicUrl(product.product_images?.filter(
                      (image) => image.image_order === 0
                    )[0]?.image_url)
                    : 'https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  isTax: !!product.tax,
                  imgBg: false,
                }}
              />
            ))}
          {serverProducts?.data?.data?.length === 0 && (
            <p className="text-start text-lg">商品がありません</p>
          )}
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-64 bg-white-bg border border-black/10"
              />
            ))}
        </div>
      </div>
    </>
  );
}
