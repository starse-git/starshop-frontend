"use client";

import { ArrowLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import RecommendProductCardComponent from "@/components/admin/RecommendProductCardComponent";
import { Form } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { useCategory } from "@/hooks/useCategory";
import { useCreateProduct } from "@/hooks/admin/useProduct";
import { Product } from "@/types/products";
import { toast } from "sonner";
import { useUploadFiles } from "@/hooks/admin/useStorage";
import { useGetRecommendProductsToChoose } from "@/hooks/admin/useRecommendProduct";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPublicUrl } from "@/utils";
import TiptapEditor from "@/components/app/TipTapEditor";
import { Category } from "@/types/categories";
import { BrandList } from "@/types/brands";
import { useBrandsList } from "@/hooks/admin/useBrands";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import ImageUploadUpdater from "@/components/admin/ImageUploadUpdater";
import { regularPercentage } from "@/data/products";

const imageSchema = z
  .object({
    file: z
      .custom<File>((val) => typeof File !== "undefined" && val instanceof File)
      .optional(),
    image_url: z.string().optional(),
    del_flg: z.boolean(),
  })
  .refine((data) => data.file || data.image_url, {
    message: "Either file or image_url is required",
    path: ["file"],
  });

// Define the schema for the product form using Zod for validation
const FormSchema = z
  .object({
    name: z.string().min(1, "商品名は必須です"),
    category: z.string().min(1, "カテゴリーは必須です"),
    tax: z.string().min(1, "税率は必須です"),
    price: z.string().min(1, "卸価格（税抜）は必須です"),
    salePrice: z.string().min(1, "販売価格（税抜）は必須です"),
    regularPercentage: z.string().min(1, "定形購入割引率は必須です"),
    regularDiscountPrice: z.string().min(1, "定形購入価格は必須です"),
    description: z.string().min(1, "説明は必須です"),
    images: z.array(imageSchema).optional(),
    stock: z.string().min(1, "在庫数は必須です"),
    safeStock: z.string().min(1, "安全な在庫数は必須です"),
    shippingFee: z.string().optional(),
    shippingType: z.string(),
    brand: z.string().min(1, "ブランドは必須です"),
    recommendProducts: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shippingType !== "free" && !data.shippingFee) {
      ctx.addIssue({
        path: ["shippingFee"],
        code: z.ZodIssueCode.custom,
        message: "配送料設定は必須です",
      });
    }
  });

const ProductPage = () => {
  const router = useRouter();
  const hasUploaded = useRef(false); // Prevents duplicate file uploads after submission

  const [isOpenToChooseRecommendProduct, setIsOpenToChooseRecommendProduct] =
    useState(false); // State to toggle the dialog for choosing recommend products

  const [selectedRecommendProducts, setSelectedRecommendProducts] = useState<
    { product_id: number; name: string; image_url: string }[]
  >([]);
  const [tempSelectedRecommendProducts, setTempSelectedRecommendProducts] =
    useState<{ product_id: number; name: string; image_url: string }[]>([]);
    
  const [salePriceWithTax, setSalePriceWithTax] = useState(0);

  const { data: categories } = useCategory(); // Custom hook to fetch category data
  const { data: recommendProducts } = useGetRecommendProductsToChoose(); // Custom hook to fetch recommend products
  const { data: brands } = useBrandsList(); // Custom hook to fetch brand data

  // Initialize react-hook-form with default values and Zod validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      category: "",
      tax: "",
      price: "",
      salePrice: "",
      regularDiscountPrice: "",
      description: "",
      images: [],
      stock: "",
      safeStock: "",
      shippingFee: "",
      shippingType: "free",
      brand: "",
      recommendProducts: [],
    },
  });

  //販売価格税込計算
  const handleSalePriceWithTax = () => {
    const salePrice = Number(form.getValues("salePrice"));
    const tax = Number(form.getValues("tax"));
    const salePriceWithTax = Math.floor(salePrice + (salePrice * tax) / 100);
    setSalePriceWithTax(salePriceWithTax);
  };

  // Mutation hooks for product creation and file uploads
  const {
    mutate: createProduct,
    error: createProductError,
    isSuccess: createProductSuccess,
    data: createProductData,
    isPending: isCreatingProduct,
  } = useCreateProduct();

  const { mutate: uploadFiles } = useUploadFiles();

  // Handles form submission: builds product object and triggers createProduct mutation
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const product: Product = {
      name: data.name,
      category_id: Number(data.category),
      tax: Number(data.tax),
      wholesale_price: Number(data.price),
      sale_price: Number(data.salePrice),
      regular_percentage: Number(data.regularPercentage),
      regular_discount: Number(data.regularDiscountPrice),
      description: data.description,
      stock_quantity: Number(data.stock),
      safe_stock_quantity: Number(data.safeStock),
      shipping_fees:
        data.shippingType === "free" ? null : Number(data.shippingFee),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      brand_id: Number(data.brand),
    };

    createProduct({
      product,
      recommendProducts: selectedRecommendProducts.map(
        (product) => product.product_id
      ),
    });
  };

  // Handle select all recommend products
  const handleToSeletAllRecommendProducts = () => {
    setSelectedRecommendProducts(tempSelectedRecommendProducts);
  };

  // Handle select recommend products
  const handleToSelectRecommendProducts = (product: {
    product_id: number;
    name: string;
    image_url: string;
  }) => {
    if (
      tempSelectedRecommendProducts.some(
        (item) => item.product_id === product.product_id
      )
    ) {
      setTempSelectedRecommendProducts(
        tempSelectedRecommendProducts.filter(
          (item) => item.product_id !== product.product_id
        )
      );
    } else {
      setTempSelectedRecommendProducts([
        ...tempSelectedRecommendProducts,
        {
          product_id: product.product_id,
          name: product.name,
          image_url: product.image_url,
        },
      ]);
    }
  };

  // Handle unselect recommend products
  const handleToUnselectRecommendProducts = (productId: number) => {
    setSelectedRecommendProducts(
      selectedRecommendProducts.filter((item) => item.product_id !== productId)
    );
  };

  // Handle success/error state after product creation
  useEffect(() => {
    if (hasUploaded.current) return;

    if (createProductError) {
      toast.error(createProductError?.message);
    }

    if (createProductData && createProductSuccess) {
      hasUploaded.current = true;
      // If there are images, upload them after product is created
      if (form.getValues("images")) {
        uploadFiles(
          {
            files: form
              .getValues("images")
              ?.filter((img) => !img.del_flg)
              .map((img) => img.file) as File[],
            productId: createProductData?.data?.data?.data?.[0]?.product_id,
          },
          {
            onSuccess: () => {
              toast.success("商品が登録されました");
              router.back();
            },
            onError: (err) => toast.error(err?.message),
          }
        );
      } else {
        toast.success("商品が登録されました");
        router.back();
      }
    }
  }, [
    createProductError,
    createProductSuccess,
    createProductData,
    form,
    uploadFiles,
    router,
  ]);

  useEffect(() => {
    if (form.watch("regularPercentage")) {
      const regularPercentage = Number(form.watch("regularPercentage"));
      const salePrice = Number(form.watch("salePrice"));
      const regularDiscountPrice = Math.floor(
        salePrice - (salePrice * regularPercentage) / 100
      );
      form.setValue("regularDiscountPrice", regularDiscountPrice.toString());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("regularPercentage")]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border"
      >
        {/* Header */}
        <div className="flex justify-between mb-5">
          <div className="flex gap-2 text-left items-center">
            <ArrowLeft size={20} onClick={() => router.back()} />
            <h2>商品登録</h2>
          </div>
          <Button
            type="submit"
            className="bg-primary/100 hover:bg-primary/60 text-white cursor-pointer"
          >
            登録
          </Button>
        </div>

        {/* Tabs */}
        <div className="w-full bg-black/5 rounded-[10px]">
          <Tabs defaultValue="productInfo" className="w-full">
            <TabsList className="w-full flex justify-start max-lg:overflow-x-auto overflow-y-hidden bg-black/5 rounded-t-[10px] rounded-b-[0px] p-4 md:p-5 gap-4 md:gap-5 h-[70px] text-black/50">
              <TabsTrigger
                value="productInfo"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-black"
              >
                商品情報
              </TabsTrigger>
              <TabsTrigger
                value="photo"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-black"
              >
                写真
              </TabsTrigger>
              <TabsTrigger
                value="stock"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-black"
              >
                在庫管理
              </TabsTrigger>
              <TabsTrigger
                value="shippingFee"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-black"
              >
                配送料設定
              </TabsTrigger>
              <TabsTrigger
                value="recommend"
                className="flex-1 rounded-[10px] p-3 md:p-5 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-black"
              >
                オススメ商品設定
              </TabsTrigger>
            </TabsList>
            {/* Product Info */}
            <TabsContent value="productInfo">
              <div className="p-5 pt-5 pb-0 w-full">
                <div className="flex flex-wrap justify-between">
                  <div className="flex flex-col w-[50%]">
                    <FormInputComponent
                      control={form.control}
                      name="name"
                      label="商品名"
                      placeholder=""
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                  <div className="flex flex-col w-[49%]">
                    <span className="text-sm -mt-0.5 mb-1">カテゴリー</span>
                    <Controller
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                            <SelectValue placeholder="カテゴリーを選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                            {categories?.data?.data?.map(
                              (category: Category) => (
                                <SelectItem
                                  key={category.category_id}
                                  value={category.category_id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-5 mt-5">
                <div className="max-lg:grid max-lg:grid-cols-2 flex flex-wrap justify-between gap-5 lg:gap-0">
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <span className="text-sm -mt-0.5 mb-1">税率</span>
                    <Controller
                      control={form.control}
                      name="tax"
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleSalePriceWithTax();
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                            <SelectValue placeholder="税率を選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="8">8%</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <FormInputComponent
                      control={form.control}
                      name="price"
                      label="卸価格"
                      placeholder=""
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <FormInputComponent
                      control={form.control}
                      name="salePrice"
                      label="販売価格(税抜)"
                      placeholder=""
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                      onBlur={handleSalePriceWithTax}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <label
                      htmlFor="salePriceWithTax"
                      className="text-sm -mt-0.5 mb-1"
                    >
                      販売価格(税込)
                    </label>
                    <input
                      type="number"
                      id="salePriceWithTax"
                      name="salePriceWithTax"
                      placeholder=""
                      value={salePriceWithTax}
                      readOnly
                      className="text-black/30 placeholder:text-sm bg-white/50 border border-white-bg rounded-[10px] p-2 text-xs"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-5 mt-5">
                <div className="max-lg:grid max-lg:grid-cols-2 flex flex-wrap gap-5">
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <span className="text-sm -mt-0.5 mb-1">定形購入割引率</span>
                    <Controller
                      key={form.watch("regularPercentage")}
                      control={form.control}
                      name="regularPercentage"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                            <SelectValue placeholder="定形購入割引率を選択" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                            {regularPercentage.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.name}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-[24%]">
                    <FormInputComponent
                      control={form.control}
                      name="regularDiscountPrice"
                      label="定形購入価格"
                      placeholder="定形購入価格"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-5">
                <p className="text-sm mb-1.5">ブランド</p>
                <Controller
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs">
                        <SelectValue placeholder="ブランドを選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-black/10 rounded-[10px]">
                        {brands?.data?.map((brand: BrandList) => (
                          <SelectItem
                            key={brand.brand_id}
                            value={brand.brand_id.toString()}
                          >
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col p-5">
                <p className="text-sm mb-1.5">説明</p>
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </TabsContent>

            {/* Photo */}
            <TabsContent value="photo">
              <div className="px-5 pt-4 pb-5">
                <p className="text-sm mb-1.5">写真</p>
                <Controller
                  name="images"
                  control={form.control}
                  render={({ field }) => (
                    <ImageUploadUpdater
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  )}
                />
                {form.formState.errors.images && (
                  <p className="text-red-500 mt-2 text-sm">
                    {form.formState.errors.images.message}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Stock */}
            <TabsContent value="stock">
              <div className="p-5 w-full">
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col">
                    <FormInputComponent
                      control={form.control}
                      name="stock"
                      label="在庫数"
                      placeholder="在庫数"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                  <div className="flex flex-col">
                    <FormInputComponent
                      control={form.control}
                      name="safeStock"
                      label="安全な在庫数"
                      placeholder="安全な在庫数"
                      className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Shipping Fee */}
            <TabsContent value="shippingFee">
              <div className="p-5 flex flex-row gap-10">
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="shippingType"
                    value="free"
                    className="w-5 h-5"
                    checked={form.getValues("shippingType") === "free"}
                    onChange={(checked) => {
                      form.setValue("shippingType", checked.target.value);
                    }}
                  />
                  <span className="text-xs">送料無料</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="shippingType"
                    value="fixed"
                    className="w-5 h-5"
                    checked={form.getValues("shippingType") === "fixed"}
                    onChange={(checked) => {
                      form.setValue("shippingType", checked.target.value);
                    }}
                  />
                  <span className="text-xs">固定送料</span>
                </div>
              </div>
              <div className="pl-5 pb-5 w-[200px] md:w-[20%]">
                <FormInputComponent
                  control={form.control}
                  name="shippingFee"
                  label=""
                  placeholder="固定送料"
                  className="placeholder:text-sm bg-white border border-black/10 rounded-[10px] p-2 text-xs"
                  disabled={form.getValues("shippingType") !== "fixed"}
                />
              </div>
            </TabsContent>

            {/* Recommend */}
            <TabsContent value="recommend">
              <div className="p-5">
                <span className="text-xs">オススメ商品</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-3">
                  {selectedRecommendProducts.map((product) => (
                    <RecommendProductCardComponent
                      key={product.product_id}
                      imgURL={product.image_url}
                      imgName={product.name}
                      active={false}
                      onRemove={() =>
                        handleToUnselectRecommendProducts(product.product_id)
                      }
                    />
                  ))}
                  <div
                    onClick={() => {
                      setIsOpenToChooseRecommendProduct(true);
                      setTempSelectedRecommendProducts(
                        selectedRecommendProducts
                      );
                    }}
                    className="w-[150px] h-[150px] bg-white flex items-center justify-center cursor-pointer"
                  >
                    <CirclePlus size={30} className="text-black/50" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </form>

      {/* Dialog for choosing recommend products */}
      <Dialog
        open={isOpenToChooseRecommendProduct}
        onOpenChange={setIsOpenToChooseRecommendProduct}
      >
        <DialogContent className="bg-white border border-black/10 rounded-[10px]">
          <DialogHeader>
            <DialogTitle>オススメ商品選択</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            {recommendProducts && recommendProducts?.data?.data?.length > 0 ? (
              <div className="grid grid-cols-3 gap-5 mt-3 h-[400px] overflow-y-scroll">
                {recommendProducts?.data?.data.map((product: Product) => (
                  <RecommendProductCardComponent
                    key={product.product_id}
                    imgURL={
                      product.product_images?.[0]?.image_url
                        ? getPublicUrl(product.product_images[0].image_url)
                        : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    imgName={product.name}
                    active={tempSelectedRecommendProducts.some(
                      (item) => item.product_id === product.product_id
                    )}
                    onClick={() =>
                      handleToSelectRecommendProducts({
                        product_id: product.product_id ?? 0,
                        name: product.name,
                        image_url: product.product_images?.[0]?.image_url
                          ? getPublicUrl(product.product_images[0].image_url)
                          : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <span>オススメ商品がありません</span>
            )}
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="bg-primary/100 hover:bg-primary/60 text-white-bg cursor-pointer"
                onClick={handleToSeletAllRecommendProducts}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ServerActionLoadingComponent
        loading={isCreatingProduct}
        message="商品作成中..."
      />
    </Form>
  );
};

export default ProductPage;
