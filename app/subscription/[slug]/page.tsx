"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRightOpen, Trash2 } from "lucide-react";

// Components
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductCell } from "@/components/cart/CartSectionOneComponent";
import { Skeleton } from "@/components/ui/skeleton";
import CounterComponent from "@/components/app/public/CounterComponent";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";

// Hooks
import {
  useProductDetail,
  useProductsByCategory,
} from "@/hooks/user/useProduct";

// Utils
import {
  convertToYen,
  decryptString,
  encryptString,
  getPublicUrl,
} from "@/utils";

// Types
import { SubscriptionCartProduct, SubscriptionProduct } from "@/types/cart";
import { Tabs } from "@/components/ui/aceternity-tabs";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FormSchema } from "@/components/cart/CartSectionTwoComponent";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddressByPostcode,
  useCreateBillingAddress,
  useCreateShippingAddress,
  useGetBillingAddress,
  useGetShippingAddress,
  useUpdateBillingAddress,
  useUpdateShippingAddress,
} from "@/hooks/user/useAddress";
import { MESSAGES } from "@/types/messages";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import Checkout from "@/components/subscription/Checkout";
import { usePurchaseTypes } from "@/hooks/usePurchase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseType } from "@/types/purchases";

// Constants
const ANIMATION_DURATION = 0.8;
const ADD_TO_CART_DELAY = 400;

// Sub-components -----------------------------------------------------------------

interface FlyingProductProps {
  product: SubscriptionCartProduct;
  startPosition: { x: number; y: number };
  direction?: "add" | "remove";
  onComplete: () => void;
}

const FlyingProduct = ({
  product,
  startPosition,
  direction = "add",
  onComplete,
}: FlyingProductProps) => {
  const targetPosition =
    direction === "add"
      ? { x: 100, y: 200 }
      : { x: window.innerWidth - 200, y: 300 };

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={{
        x: startPosition.x,
        y: startPosition.y,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: targetPosition.x,
        y: targetPosition.y,
        scale: 0.8,
        opacity: 0.8,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: ANIMATION_DURATION,
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
    >
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
        <Image
          src={getPublicUrl(product.product_images?.[0]?.image_url || "")}
          alt={product.name}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
        <span className="text-sm font-medium">{product.name}</span>
      </div>
    </motion.div>
  );
};

interface ProductRowToAddProps {
  product: SubscriptionCartProduct;
  onAddProduct: (
    product: SubscriptionCartProduct,
    buttonRef: HTMLButtonElement
  ) => void;
}

const ProductRowToAdd = ({ product, onAddProduct }: ProductRowToAddProps) => {
  const router = useRouter();

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onAddProduct(product, e.currentTarget);
  };

  const navigateToProduct = () => {
    router.push(`/products/${encryptString(product.product_id.toString())}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-between p-2 border border-black/10 rounded-md bg-white"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-[80px] h-[80px] bg-white border border-black/10 cursor-pointer"
          onClick={navigateToProduct}
        >
          <Image
            src={getPublicUrl(product.product_images?.[0]?.image_url || "")}
            alt={product.name || ""}
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <p className="font-bold">{product.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-normal line-through">
              {convertToYen(product.sale_price)}
            </p>
            <span className="text-normal">
              {product.regular_percentage}% 割引
            </span>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {convertToYen(product.regular_discount)}
          </p>
        </div>
      </div>
      <div>
        <Button
          variant="outline"
          onClick={handleAddClick}
          className="cursor-pointer"
        >
          追加
        </Button>
      </div>
    </motion.div>
  );
};

interface ProductRowProps {
  product: SubscriptionCartProduct;
  onQuantityChange: (productId: number, quantity: number, tax: number) => void;
  onRemoveProduct: (
    product: SubscriptionCartProduct,
    buttonRef: HTMLButtonElement
  ) => void;
}

const ProductRow = ({
  product,
  onQuantityChange,
  onRemoveProduct,
}: ProductRowProps) => {
  const router = useRouter();
  const [count, setCount] = useState<number>(product.quantity);

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onRemoveProduct(product, e.currentTarget);
  };

  const navigateToProduct = () => {
    router.push(`/products/${encryptString(product.product_id.toString())}`);
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity === 0) {
      const buttonElement = document.createElement("button");
      onRemoveProduct(product, buttonElement);
    } else {
      onQuantityChange(product.product_id, quantity, product.tax);
    }
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      key={product.product_id}
      className="border-b border-gray-100"
    >
      <TableCell className="md:px-6 px-3 md:py-4 py-4">
        <ProductCell
          name={product.name}
          price={product.sale_price}
          image={
            product.product_images?.[0]
              ? getPublicUrl(product.product_images[0].image_url)
              : "/placeholder.svg?height=64&width=64"
          }
          onClick={navigateToProduct}
        />
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex gap-1 items-center">
          <p className="line-through">{convertToYen(product.sale_price)}</p>
          <span className="text-normal">
            {product.regular_percentage}% 割引
          </span>
        </div>
        <div>
          <p className="font-bold text-lg text-blue-600">
            {convertToYen(product.regular_discount)}
          </p>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <CounterComponent
          max={product.stock_quantity}
          min={product.safe_stock_quantity}
          count={count}
          setCount={setCount}
          handleToClick={handleQuantityChange}
        />
      </TableCell>
      <TableCell className="text-left px-6 py-4">
        {convertToYen(product.total)}
      </TableCell>
      <TableCell className="text-right px-6 py-4">
        <Button
          variant="outline"
          onClick={handleRemoveClick}
          className="cursor-pointer text-red-600"
        >
          <Trash2 />
        </Button>
      </TableCell>
    </motion.tr>
  );
};

const PriceSummary = ({
  subscriptionProducts,
}: {
  subscriptionProducts: SubscriptionProduct;
}) => (
  <div className="mt-4 md:px-6 px-4 md:py-10 py-8 md:space-y-6 space-y-4">
    <div className="flex justify-between">
      <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
        <p>小計</p>
      </div>
      <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
        <p>{convertToYen(subscriptionProducts?.sub_total || 0)}</p>
      </div>
    </div>
    <div className="flex justify-between">
      <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
        <p>税金 (8%)</p>
      </div>
      <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
        <p>{convertToYen(subscriptionProducts?.tax_eight || 0)}</p>
      </div>
    </div>
    <div className="flex justify-between">
      <div className="md:w-[70%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
        <p>税金 (10%)</p>
      </div>
      <div className="md:w-[30%] flex justify-end md:font-semibold font-normal md:text-base text-sm">
        <p>{convertToYen(subscriptionProducts?.tax_ten || 0)}</p>
      </div>
    </div>
    <div className="flex justify-between border-t pt-4 border-white-bg">
      <div className="md:w-[70%] flex justify-end font-bold text-2xl">
        <p>合計</p>
      </div>
      <div className="md:w-[30%] flex justify-end font-bold text-2xl text-blue-600">
        <p>{convertToYen(subscriptionProducts?.total_price || 0)}</p>
      </div>
    </div>
  </div>
);

// Main Component -----------------------------------------------------------------

const SubscriptionPage = () => {
  const params = useParams();
  const [productId, setProductId] = useState<number>();
  const [subscriptionProducts, setSubscriptionProducts] =
    useState<SubscriptionProduct>({
      sub_total: 0,
      tax_eight: 0,
      tax_ten: 0,
      total_price: 0,
      products: [],
    });
  const [availableProducts, setAvailableProducts] = useState<
    SubscriptionCartProduct[]
  >([]);
  const [flyingProduct, setFlyingProduct] = useState<{
    product: SubscriptionCartProduct;
    startPosition: { x: number; y: number };
  } | null>(null);
  const [flyingRemovedProduct, setFlyingRemovedProduct] = useState<{
    product: SubscriptionCartProduct;
    startPosition: { x: number; y: number };
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [shippingAddressId, setShippingAddressId] = useState<number>();
  const [billingAddressId, setBillingAddressId] = useState<number>();
  const [purchaseType, setPurchaseType] = useState<number>();

  const [activeTab, setActiveTab] = useState<string>("products");

  const { data: shippingAddress } = useGetShippingAddress(); // 配送先住所を取得
  const { data: billingAddress } = useGetBillingAddress(); // 請求先住所を取得
  const { data: purchaseTypes } = usePurchaseTypes(); // 購入方法を取得

  const {
    mutate: updateShippingAddress,
    isPending: updateShippingAddressLoading,
  } = useUpdateShippingAddress(); // 配送先住所を更新
  const {
    mutate: updateBillingAddress,
    isPending: updateBillingAddressLoading,
  } = useUpdateBillingAddress(); // 請求先住所を更新
  const { mutate: createShippingAddress, data: createShippingAddressData } =
    useCreateShippingAddress(); // 配送先住所を登録
  const { mutate: createBillingAddress, data: createBillingAddressData } =
    useCreateBillingAddress(); // 請求先住所を登録
  const { mutate: getAddressByPostcode } = useAddressByPostcode(); // 郵便番号を取得

  // 配送先住所を郵便番号で検索
  const handleGetShippingAddressByPostcode = (postcode: string) => {
    getAddressByPostcode(
      { postcode },
      {
        onSuccess: (data) => {
          form.setValue(
            "city",
            data?.data?.city_ward_town +
              " " +
              data?.data?.prefecture +
              " " +
              data?.data?.address
          );
        },
        onError: (err: Error) => {
          const error = err as AxiosError<{ error?: string }>;
          toast.error(
            error?.response?.data?.error || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };

  // 請求先住所を郵便番号で検索
  const handleGetBillingAddressByPostcode = (postcode: string) => {
    getAddressByPostcode(
      { postcode },
      {
        onSuccess: (data) => {
          form.setValue(
            "sCity",
            data?.data?.city_ward_town +
              " " +
              data?.data?.prefecture +
              " " +
              data?.data?.address
          );
        },
        onError: (err: Error) => {
          const error = err as AxiosError<{ error?: string }>;
          toast.error(
            error?.response?.data?.error || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };

  // 配送先住所を更新
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      zip: "",
      city: "",
      address: "",
      building: "",
      room: "",
      isDifferentAddress: false,
      point: "0",
      sFirstName: "",
      sLastName: "",
      sPhone: "",
      sZip: "",
      sCity: "",
      sAddress: "",
      sBuilding: "",
      sRoom: "",
    },
  });

  // 配送先住所を登録
  const creatingAddress = (data: z.infer<typeof FormSchema>) => {
    createShippingAddress(
      {
        addressData: {
          recipient_first_name: data.firstName || "",
          recipient_last_name: data.lastName || "",
          recipient_phone_number: data.phone || "",
          postal_code: data.zip || "",
          prefecture: data.city || "",
          city: data.city || "",
          street_address: data.address || "",
          building_name: data.building || "",
          room_number: data.room || "",
          country: "Japan",
        },
      },
      {
        onSuccess: () => {
          setShippingAddressId(createShippingAddressData?.data?.address_id);
          createBillingAddress(
            {
              addressData: {
                recipient_first_name: data.isDifferentAddress
                  ? data.sFirstName || ""
                  : data.firstName || "",
                recipient_last_name: data.isDifferentAddress
                  ? data.sLastName || ""
                  : data.lastName || "",
                recipient_phone_number: data.isDifferentAddress
                  ? data.sPhone || ""
                  : data.phone || "",
                postal_code: data.isDifferentAddress
                  ? data.sZip || ""
                  : data.zip || "",
                prefecture: data.isDifferentAddress
                  ? data.sCity || ""
                  : data.city || "",
                city: data.isDifferentAddress
                  ? data.sCity || ""
                  : data.city || "",
                street_address: data.isDifferentAddress
                  ? data.sAddress || ""
                  : data.address || "",
                building_name: data.isDifferentAddress
                  ? data.sBuilding || ""
                  : data.building || "",
                room_number: data.isDifferentAddress
                  ? data.sRoom || ""
                  : data.room || "",
                country: "Japan",
              },
            },
            {
              onSuccess: () => {
                setBillingAddressId(createBillingAddressData?.data?.address_id);
                setActiveTab("payment");
              },
              onError: (err) => {
                const error = err as AxiosError<{ message?: string }>;
                toast.error(
                  error?.response?.data?.message ||
                    MESSAGES.COMMON.UNEXPECTED_ERROR
                );
              },
            }
          );
        },
        onError: (err) => {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };

  // 配送先住所を更新
  const updatingAddresses = (data: z.infer<typeof FormSchema>) => {
    updateShippingAddress(
      {
        addressId: shippingAddress?.data?.address_id,
        addressData: {
          recipient_first_name: data.firstName || "",
          recipient_last_name: data.lastName || "",
          recipient_phone_number: data.phone || "",
          postal_code: data.zip || "",
          prefecture: data.city || "",
          city: data.city || "",
          street_address: data.address || "",
          building_name: data.building || "",
          room_number: data.room || "",
          country: "Japan",
        },
      },
      {
        onSuccess: () => {
          setShippingAddressId(shippingAddress?.data?.address_id);
          updateBillingAddress(
            {
              addressId: billingAddress?.data?.address_id,
              addressData: {
                recipient_first_name: data.isDifferentAddress
                  ? data.sFirstName || ""
                  : data.firstName || "",
                recipient_last_name: data.isDifferentAddress
                  ? data.sLastName || ""
                  : data.lastName || "",
                recipient_phone_number: data.isDifferentAddress
                  ? data.sPhone || ""
                  : data.phone || "",
                postal_code: data.isDifferentAddress
                  ? data.sZip || ""
                  : data.zip || "",
                prefecture: data.isDifferentAddress
                  ? data.sCity || ""
                  : data.city || "",
                city: data.isDifferentAddress
                  ? data.sCity || ""
                  : data.city || "",
                street_address: data.isDifferentAddress
                  ? data.sAddress || ""
                  : data.address || "",
                building_name: data.isDifferentAddress
                  ? data.sBuilding || ""
                  : data.building || "",
                room_number: data.isDifferentAddress
                  ? data.sRoom || ""
                  : data.room || "",
                country: "Japan",
              },
            },
            {
              onSuccess: () => {
                setBillingAddressId(billingAddress?.data?.address_id);
                setActiveTab("payment");
              },
              onError: (err) => {
                const error = err as AxiosError<{ message?: string }>;
                toast.error(
                  error?.response?.data?.message ||
                    MESSAGES.COMMON.UNEXPECTED_ERROR
                );
              },
            }
          );
        },
        onError: (err) => {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };

  // 配送先住所を更新または登録
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (shippingAddress?.data?.address_id) {
      updatingAddresses(data);
    } else {
      creatingAddress(data);
    }
  };

  // Handle animation completion
  const handleFlyingComplete = () => setFlyingProduct(null);
  const handleFlyingRemovedComplete = () => setFlyingRemovedProduct(null);

  // Data fetching
  const {
    data: serverProducts,
    isLoading: productsLoading,
    error,
    isError,
  } = useProductsByCategory("all", "all");

  const {
    data: productData,
    isLoading: productDetailLoading,
    error: productError,
    isError: productIsError,
  } = useProductDetail(productId || 0);

  // Calculate cart totals
  const calculateCartTotals = (products: SubscriptionCartProduct[]) => {
    let subTotal = 0;
    let taxEight = 0;
    let taxTen = 0;

    products.forEach((item) => {
      subTotal += item.total;
      const taxPerUnit = Math.floor((item.regular_discount * item.tax) / 100);
      const taxAmount = taxPerUnit * item.quantity;

      if (item.tax === 8) {
        taxEight += taxAmount;
      } else if (item.tax === 10) {
        taxTen += taxAmount;
      }
    });

    return {
      sub_total: subTotal,
      tax_eight: taxEight,
      tax_ten: taxTen,
      total_price: subTotal + taxEight + taxTen,
      products,
    };
  };

  // Handle quantity change
  const handleQuantityChange = (
    productId: number,
    quantity: number,
    tax: number
  ) => {
    const updatedProducts = subscriptionProducts.products.map((item) => {
      if (item.product_id === productId) {
        return {
          ...item,
          quantity,
          total: item.regular_discount * quantity,
          tax,
        };
      }
      return item;
    });

    setSubscriptionProducts(calculateCartTotals(updatedProducts));
  };

  // Handle add product
  const handleAddProduct = (
    product: SubscriptionCartProduct,
    buttonRef: HTMLButtonElement
  ) => {
    // Animation setup
    const rect = buttonRef.getBoundingClientRect();
    setFlyingProduct({
      product,
      startPosition: { x: rect.left, y: rect.top },
    });

    // Add to cart after delay
    setTimeout(() => {
      const newCartProduct: SubscriptionCartProduct = {
        ...product,
        quantity: 1,
        total: product.regular_discount,
      };

      const updatedProducts = [
        ...subscriptionProducts.products,
        newCartProduct,
      ];
      setSubscriptionProducts(calculateCartTotals(updatedProducts));
      setAvailableProducts((prev) =>
        prev.filter((p) => p.product_id !== product.product_id)
      );

      toast.success(`${product.name || ""} を定期購入カートに追加しました！`);
    }, ADD_TO_CART_DELAY);
  };

  // Handle remove product
  const handleRemoveProduct = (
    product: SubscriptionCartProduct,
    buttonRef: HTMLButtonElement
  ) => {
    // Animation setup
    const rect = buttonRef.getBoundingClientRect();
    setFlyingRemovedProduct({
      product,
      startPosition: { x: rect.left, y: rect.top },
    });

    // Remove from cart after delay
    setTimeout(() => {
      const updatedProducts = subscriptionProducts.products.filter(
        (p) => p.product_id !== product.product_id
      );

      setSubscriptionProducts(calculateCartTotals(updatedProducts));
      setAvailableProducts((prev) =>
        [
          ...prev,
          {
            ...product,
            quantity: 0,
            total: 0,
          },
        ].sort((a, b) => (a.product_id || 0) - (b.product_id || 0))
      );

      toast.success(`${product.name} を定期購入カートから削除しました！`);
    }, ADD_TO_CART_DELAY);
  };

  const handleTabChange = (tab: string) => {
    if (tab === "delivery" || tab === "payment") {
      if (subscriptionProducts.products.length === 0) {
        toast.error("商品を選択してください");
        return;
      }
    }
    if (tab === "payment") {
      if (!shippingAddressId || !billingAddressId) {
        toast.error("配送先住所と請求先住所を選択してください");
        return;
      }
    }
    setActiveTab(tab);
  };

  // Effects
  useEffect(() => {
    if (productData) {
      const { data } = productData;
      const product: SubscriptionCartProduct = {
        product_id: data[0]?.product_id,
        name: data[0]?.name,
        sale_price: data[0]?.sale_price,
        regular_discount: data[0]?.regular_discount,
        regular_percentage: data[0]?.regular_percentage,
        tax: data[0]?.tax,
        quantity: 1,
        stock_quantity: data[0]?.stock_quantity,
        safe_stock_quantity: data[0]?.safe_stock_quantity,
        product_images: data[0]?.product_images,
        total: data[0]?.regular_discount,
      };
      setSubscriptionProducts(calculateCartTotals([product]));
    }
  }, [productData]);

  useEffect(() => {
    if (params.slug) {
      const productId = decryptString(params.slug as string);
      setProductId(Number(productId));
    }
  }, [params.slug]);

  useEffect(() => {
    if (serverProducts) {
      const { data } = serverProducts;
      setAvailableProducts(
        data.data.filter(
          (item: SubscriptionCartProduct) => item.product_id !== productId
        )
      );
    }
  }, [serverProducts, productId]);

  useEffect(() => {
    if (!shippingAddress) return;
    setShippingAddressId(shippingAddress?.data?.address_id);
    form.setValue("firstName", shippingAddress?.data?.recipient_first_name);
    form.setValue("lastName", shippingAddress?.data?.recipient_last_name);
    form.setValue("phone", shippingAddress?.data?.recipient_phone_number);
    form.setValue("zip", shippingAddress?.data?.postal_code);
    form.setValue("city", shippingAddress?.data?.city);
    form.setValue("address", shippingAddress?.data?.street_address);
    form.setValue("building", shippingAddress?.data?.building_name);
    form.setValue("room", shippingAddress?.data?.room_number);
  }, [shippingAddress, form]);

  useEffect(() => {
    if (!billingAddress) return;
    setBillingAddressId(billingAddress?.data?.address_id);
    form.setValue("isDifferentAddress", true);
    form.setValue("sFirstName", billingAddress?.data?.recipient_first_name);
    form.setValue("sLastName", billingAddress?.data?.recipient_last_name);
    form.setValue("sPhone", billingAddress?.data?.recipient_phone_number);
    form.setValue("sZip", billingAddress?.data?.postal_code);
    form.setValue("sCity", billingAddress?.data?.city);
    form.setValue("sAddress", billingAddress?.data?.street_address);
    form.setValue("sBuilding", billingAddress?.data?.building_name);
    form.setValue("sRoom", billingAddress?.data?.room_number);
  }, [billingAddress, form]);

  useEffect(() => {
    if (purchaseTypes?.data) {
      const { data } = purchaseTypes;
      setPurchaseType(data[0]?.interval_month);
    }
  }, [purchaseTypes]);

  useEffect(() => {
    if (productIsError) {
      const error = productError as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message);
    }

    if (isError) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err?.response?.data?.message);
    }
  }, [productIsError, productError, error, isError]);

  return (
    <PublicDetailsLayout className="space-y-10">
      <div className="max-w-7xl mx-auto p-6 space-y-10">
        <div className="text-left flex justify-between items-center">
          <span className="text-5xl font-serif text-gray-800">定期購入</span>
        </div>

        <div>
          <Tabs
            activeValue={activeTab}
            tabs={[
              {
                title: "商品",
                value: "products",
                content: (
                  <div className="flex flex-col space-y-4">
                    <div className="w-full border border-gray-200 bg-white rounded-lg p-4 flex justify-between items-center">
                      <Select
                        value={purchaseType?.toString()}
                        onValueChange={(value) =>
                          setPurchaseType(Number(value))
                        }
                      >
                        <SelectTrigger className="w-[150px] text-sm border border-white-bg rounded-md p-2">
                          <SelectValue placeholder="購入方法を選択" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-white-bg rounded-md">
                          {purchaseTypes?.data?.map((option: PurchaseType) => (
                            <SelectItem
                              key={option.interval_month}
                              value={option.interval_month.toString()}
                            >
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 items-center">
                        <p>追加可能な商品を見る</p>
                        <Button
                          variant="outline"
                          onClick={() => setOpen(true)}
                          className="cursor-pointer"
                        >
                          <PanelRightOpen />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-4">
                        <div className="w-full border border-gray-200 bg-white rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-gray-100">
                                <TableHead className="md:px-6 px-3 md:py-4 py-2">
                                  商品
                                </TableHead>
                                <TableHead className="md:px-6 px-3 md:py-4 py-2">
                                  価格（税抜）
                                </TableHead>
                                <TableHead className="md:px-6 px-3 md:py-4 py-2">
                                  個数
                                </TableHead>
                                <TableHead className="md:px-6 px-3 md:py-4 py-2">
                                  合計金額
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <AnimatePresence>
                                {subscriptionProducts?.products
                                  ?.filter((product) => product.quantity > 0)
                                  .map((product) => (
                                    <ProductRow
                                      key={product.product_id}
                                      product={product}
                                      onQuantityChange={handleQuantityChange}
                                      onRemoveProduct={handleRemoveProduct}
                                    />
                                  ))}
                              </AnimatePresence>

                              {productDetailLoading &&
                                Array.from({ length: 3 }).map((_, index) => (
                                  <TableRow
                                    key={index}
                                    className="border-b border-gray-100"
                                  >
                                    <TableCell colSpan={4} className="h-16">
                                      <Skeleton className="h-full bg-gray-100" />
                                    </TableCell>
                                  </TableRow>
                                ))}

                              {!productDetailLoading &&
                                subscriptionProducts.products.length === 0 && (
                                  <TableRow className="border-b border-gray-100">
                                    <TableCell
                                      colSpan={4}
                                      className="h-16 text-center"
                                    >
                                      <p className="text-gray-500">
                                        定期購入カートに商品がありません
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                )}
                            </TableBody>
                          </Table>

                          <PriceSummary
                            subscriptionProducts={subscriptionProducts}
                          />
                        </div>
                      </div>

                      {/* Flying Product Animation */}
                      <AnimatePresence>
                        {flyingProduct && (
                          <FlyingProduct
                            product={flyingProduct.product}
                            startPosition={flyingProduct.startPosition}
                            onComplete={handleFlyingComplete}
                          />
                        )}
                        {flyingRemovedProduct && (
                          <FlyingProduct
                            product={flyingRemovedProduct.product}
                            startPosition={flyingRemovedProduct.startPosition}
                            direction="remove"
                            onComplete={handleFlyingRemovedComplete}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="w-[150px] text-white cursor-pointer"
                        disabled={productDetailLoading}
                        onClick={() => handleTabChange("delivery")}
                      >
                        {productDetailLoading ? "Loading..." : "次へ"}
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                title: "配送",
                value: "delivery",
                content: () => (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex gap-6 md:flex-row flex-col"
                    >
                      <div className="md:w-1/2 w-full space-y-4">
                        {/* Shipping Address */}
                        <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white/50">
                          <h2 className="font-bold">配送先</h2>

                          <div className="space-y-8 w-full">
                            <div className="w-full flex space-x-3">
                              <div className="w-1/2">
                                <FormInputComponent
                                  control={form.control}
                                  name="firstName"
                                  label="姓 (必須)"
                                  placeholder=""
                                  className="h-11 placeholder:text-sm text-xs"
                                />
                              </div>
                              <div className="w-1/2">
                                <FormInputComponent
                                  control={form.control}
                                  name="lastName"
                                  label="名 (必須)"
                                  placeholder=""
                                  className="h-11 placeholder:text-sm text-xs"
                                />
                              </div>
                            </div>
                            <FormInputComponent
                              control={form.control}
                              name="phone"
                              label="電話番号 (必須)"
                              type="tel"
                              placeholder=""
                              className="h-11 placeholder:text-sm text-xs"
                            />

                            <div className="w-full flex space-x-3 md:flex-row flex-col md:space-y-0 space-y-6">
                              <div className="md:w-1/3 w-full">
                                <FormInputComponent
                                  control={form.control}
                                  name="zip"
                                  label="郵便番号 (必須)"
                                  placeholder=""
                                  className="h-11 placeholder:text-sm text-xs"
                                  onBlur={() =>
                                    handleGetShippingAddressByPostcode(
                                      form.getValues("zip")
                                    )
                                  }
                                />
                              </div>
                              <div className="md:w-2/3 w-full">
                                <FormInputComponent
                                  control={form.control}
                                  name="city"
                                  label="市区町村 (必須)"
                                  placeholder=""
                                  className="h-11 placeholder:text-sm text-xs"
                                />
                              </div>
                            </div>

                            <FormInputComponent
                              control={form.control}
                              name="address"
                              label="番地 (必須)"
                              placeholder=""
                              className="h-11 placeholder:text-sm text-xs"
                            />

                            <FormInputComponent
                              control={form.control}
                              name="building"
                              label="建物名（任意）"
                              placeholder=""
                              className="h-11 placeholder:text-sm text-xs"
                            />

                            <FormInputComponent
                              control={form.control}
                              name="room"
                              label="部屋番号（任意）"
                              placeholder=""
                              className="h-11 placeholder:text-sm text-xs"
                            />
                          </div>
                        </div>

                        {/* Billing Address */}
                        <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white/50">
                          <div className="flex items-center justify-between">
                            <h1>請求先</h1>
                            <div className="flex items-center space-x-2">
                              <FormInputComponent
                                control={form.control}
                                name="isDifferentAddress"
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer"
                                id="isDifferentAddress"
                                checked={form.watch("isDifferentAddress")}
                              />
                              <label
                                htmlFor="isDifferentAddress"
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                配送先と違う住所を設定
                              </label>
                            </div>
                          </div>
                          {form.watch("isDifferentAddress") && (
                            <div className="space-y-8 w-full">
                              <div className="w-full flex space-x-3">
                                <div className="w-1/2">
                                  <FormInputComponent
                                    control={form.control}
                                    name="sFirstName"
                                    label="姓 (必須)"
                                    placeholder=""
                                    className="h-11 placeholder:text-sm text-xs"
                                  />
                                </div>
                                <div className="w-1/2">
                                  <FormInputComponent
                                    control={form.control}
                                    name="sLastName"
                                    label="名 (必須)"
                                    placeholder=""
                                    className="h-11 placeholder:text-sm text-xs"
                                  />
                                </div>
                              </div>
                              <FormInputComponent
                                control={form.control}
                                name="sPhone"
                                label="電話番号 (必須)"
                                type="tel"
                                placeholder=""
                                className="h-11 placeholder:text-sm text-xs"
                              />

                              <div className="w-full flex space-x-3 md:flex-row flex-col md:space-y-0 space-y-6">
                                <div className="md:w-1/3 w-full">
                                  <FormInputComponent
                                    control={form.control}
                                    name="sZip"
                                    label="郵便番号 (必須)"
                                    placeholder=""
                                    className="h-11 placeholder:text-sm text-xs"
                                    onBlur={() =>
                                      handleGetBillingAddressByPostcode(
                                        form.getValues("sZip") || ""
                                      )
                                    }
                                  />
                                </div>
                                <div className="md:w-2/3 w-full">
                                  <FormInputComponent
                                    control={form.control}
                                    name="sCity"
                                    label="市区町村"
                                    placeholder=""
                                    className="h-11 placeholder:text-sm text-xs"
                                  />
                                </div>
                              </div>

                              <FormInputComponent
                                control={form.control}
                                name="sAddress"
                                label="番地 (必須)"
                                placeholder=""
                                className="h-11 placeholder:text-sm text-xs"
                              />

                              <FormInputComponent
                                control={form.control}
                                name="sBuilding"
                                label="建物名（任意）"
                                placeholder=""
                                className="h-11 placeholder:text-sm text-xs"
                              />

                              <FormInputComponent
                                control={form.control}
                                name="sRoom"
                                label="部屋番号（任意）"
                                placeholder=""
                                className="h-11 placeholder:text-sm text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:w-1/2 w-full space-y-6">
                        <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white/50">
                          <div className="space-y-4">
                            {subscriptionProducts?.products?.map((product) => (
                              <ProductCell
                                key={product.product_id}
                                name={product.name}
                                price={product.regular_discount}
                                image={
                                  product.product_images[0]
                                    ? getPublicUrl(
                                        product.product_images[0].image_url
                                      )
                                    : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                }
                                count={product.quantity}
                              />
                            ))}
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <p className="text-sm">小計</p>
                              <p className="text-normal">
                                {convertToYen(
                                  subscriptionProducts?.sub_total || 0
                                )}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm">税金 (8%)</p>
                              <p className="text-normal">
                                {convertToYen(
                                  subscriptionProducts?.tax_eight || 0
                                )}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm">税金 (10%)</p>
                              <p className="text-normal">
                                {convertToYen(
                                  subscriptionProducts?.tax_ten || 0
                                )}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="font-semibold text-xl">合計</p>
                              <p className="font-semibold text-xl">
                                {convertToYen(
                                  subscriptionProducts?.total_price || 0
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            onClick={() => handleTabChange("products")}
                            className="w-[150px] text-black cursor-pointer rounded-md bg-white border border-black/10 hover:bg-white/20"
                          >
                            戻る
                          </Button>
                          <Button
                            type="submit"
                            className="w-[150px] bg-primary text-white cursor-pointer rounded-md"
                            disabled={updateShippingAddressLoading || updateBillingAddressLoading}
                          >
                            {updateShippingAddressLoading || updateBillingAddressLoading ? (
                              "更新中..."
                            ) : (
                              "支払いへ"
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                ),
              },
              {
                title: "支払い",
                value: "payment",
                content: (
                  <div className="flex gap-6 mt-10 md:flex-row flex-col">
                    <div className="md:w-1/2 w-full space-y-4 rounded-md overflow-hidden border border-white-bg pb-6 bg-white md:px-6 md:py-10 px-3 py-0">
                      {subscriptionProducts?.products?.length > 0 &&
                        purchaseType &&
                        billingAddressId &&
                        shippingAddressId && (
                          <Checkout
                            subscriptionProducts={subscriptionProducts}
                            billingAddressId={billingAddressId}
                            shippingAddressId={shippingAddressId}
                            monthInterval={purchaseType}
                          />
                        )}
                    </div>

                    <div className="md:w-1/2 w-full space-y-6">
                      <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white">
                        <div className="space-y-4">
                          {subscriptionProducts?.products?.map((product) => (
                            <ProductCell
                              key={product.product_id}
                              name={product.name}
                              price={product.regular_discount}
                              image={
                                product?.product_images?.[0]?.image_url
                                  ? getPublicUrl(
                                      product.product_images[0].image_url
                                    )
                                  : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                              }
                              count={product.quantity}
                            />
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">小計</p>
                            <p className="text-normal">
                              {convertToYen(
                                subscriptionProducts?.sub_total || 0
                              )}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">税金 (8%)</p>
                            <p className="text-normal">
                              {convertToYen(
                                subscriptionProducts?.tax_eight || 0
                              )}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">税金 (10%)</p>
                            <p className="text-normal">
                              {convertToYen(subscriptionProducts?.tax_ten || 0)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-xl">合計</p>
                            <p className="font-semibold text-xl">
                              {convertToYen(
                                subscriptionProducts?.total_price || 0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleTabChange("delivery")}
                          className="w-[150px] text-black cursor-pointer rounded-md border border-black/10 bg-white hover:bg-white/20"
                        >
                          戻る
                        </Button>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Sheet Addable Products */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full h-[100vh] bg-white border border-gray-200 p-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>追加可能な商品</SheetTitle>
          </SheetHeader>
          <div className="space-y-3">
            <AnimatePresence>
              {availableProducts.length > 0 ? (
                availableProducts.map((product) => (
                  <ProductRowToAdd
                    key={product.product_id}
                    product={product}
                    onAddProduct={handleAddProduct}
                  />
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 py-8"
                >
                  すべての商品が定期購入カートに追加されました
                </motion.p>
              )}
            </AnimatePresence>

            {productsLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 bg-gray-100" />
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </PublicDetailsLayout>
  );
};

export default SubscriptionPage;
