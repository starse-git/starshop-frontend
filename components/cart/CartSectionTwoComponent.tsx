"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { ProductCell } from "./CartSectionOneComponent";
import { convertToYen, getPublicUrl } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetCartItems } from "@/hooks/user/useCart";
import { useEffect, useState } from "react";
import { CartItem } from "@/types/cart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddressByPostcode,
  useCreateBillingAddress,
  useCreateShippingAddress,
  useGetBillingAddress,
  useGetShippingAddress,
  useUpdateBillingAddress,
  useUpdateShippingAddress,
} from "@/hooks/user/useAddress";
import { AxiosError } from "axios";
import { MESSAGES } from "@/types/messages";

export const FormSchema = z
  .object({
    firstName: z.string().min(2, "名前は2文字以上で入力してください"),
    lastName: z.string().min(2, "名前は2文字以上で入力してください"),
    phone: z
      .string()
      .min(2, "電話番号は2文字以上で入力してください")
      .regex(/^[0-9]{10,11}$/, "電話番号は10桁または11桁で入力してください"),
    zip: z.string().regex(/^[0-9]{7}$/, "郵便番号は7桁で入力してください"),
    city: z.string().min(2, "郵便番号で検索してください"),
    address: z.string().min(2, "番地は2文字以上で入力してください"),
    building: z.string().optional(),
    room: z.string().optional(),
    isDifferentAddress: z.boolean().default(false).optional(),
    point: z.string().default("0").optional(),
    sFirstName: z.string().optional(),
    sLastName: z.string().optional(),
    sPhone: z.string().optional(),
    sZip: z.string().optional(),
    sCity: z.string().optional(),
    sAddress: z.string().optional(),
    sBuilding: z.string().optional(),
    sRoom: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isDifferentAddress) {
      if (!data.sFirstName || data.sFirstName.length < 2) {
        ctx.addIssue({
          path: ["sFirstName"],
          code: z.ZodIssueCode.custom,
          message: "配送先の名前は2文字以上で入力してください",
        });
      }
      if (!data.sLastName || data.sLastName.length < 2) {
        ctx.addIssue({
          path: ["sLastName"],
          code: z.ZodIssueCode.custom,
          message: "配送先の名前は2文字以上で入力してください",
        });
      }
      if (!data.sPhone || !/^[0-9]{10,11}$/.test(data.sPhone)) {
        ctx.addIssue({
          path: ["sPhone"],
          code: z.ZodIssueCode.custom,
          message: "配送先の電話番号は10桁または11桁で入力してください",
        });
      }
      if (!data.sZip || !/^[0-9]{7}$/.test(data.sZip)) {
        ctx.addIssue({
          path: ["sZip"],
          code: z.ZodIssueCode.custom,
          message: "配送先の郵便番号は7桁で入力してください",
        });
      }
      if (!data.sCity || data.sCity.length < 2) {
        ctx.addIssue({
          path: ["sCity"],
          code: z.ZodIssueCode.custom,
          message: "配送先の市区町村は2文字以上で入力してください",
        });
      }
      if (!data.sAddress || data.sAddress?.length < 2) {
        ctx.addIssue({
          path: ["sAddress"],
          code: z.ZodIssueCode.custom,
          message: "配送先の番地は2文字以上で入力してください",
        });
      }
    }
  });

const CartSectionTwoComponent = ({
  handleToPreviousStep,
  handleToNextStep,
  setBillingAddressId,
  setShippingAddressId,
}: {
  handleToPreviousStep: () => void;
  handleToNextStep: () => void;
  setBillingAddressId: (id: number) => void;
  setShippingAddressId: (id: number) => void;
}) => {
  const { data: cartItems, isLoading, error, isError } = useGetCartItems(); // カートアイテムを取得
  const { data: shippingAddress } = useGetShippingAddress(); // 配送先住所を取得
  const { data: billingAddress } = useGetBillingAddress(); // 請求先住所を取得

  const { mutate: updateShippingAddress } = useUpdateShippingAddress(); // 配送先住所を更新
  const { mutate: updateBillingAddress } = useUpdateBillingAddress(); // 請求先住所を更新
  const { mutate: createShippingAddress, data: createShippingAddressData } =
    useCreateShippingAddress(); // 配送先住所を登録
  const { mutate: createBillingAddress, data: createBillingAddressData } =
    useCreateBillingAddress(); // 請求先住所を登録

  const { mutate: getAddressByPostcode } = useAddressByPostcode(); // 郵便番号を取得

  const [cart, setCart] = useState<CartItem>({} as CartItem); // カートアイテムを保持

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
                handleToNextStep();
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
                handleToNextStep();
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

  useEffect(() => {
    if (!shippingAddress) return;
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
    if (!cartItems?.data) return;
    setCart(cartItems?.data);
  }, [cartItems]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [error, isError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 mt-10 md:flex-row flex-col">
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
                      handleGetShippingAddressByPostcode(form.getValues("zip"))
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

          {/* <div className="px-6 py-10 border border-white-bg rounded-md space-y-2">
            <FormInputComponent
              control={form.control}
              name="point"
              className="w-full"
              type="number"
              label="ご利用可能なポイント 150P"
              addon={
                <Button
                  type="button"
                  className="rounded-l-none rounded-r-sm bg-black/70 text-white cursor-pointer hover:bg-black/80"
                >
                  適用
                </Button>
              }
            />
          </div> */}
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
            <Button
              type="submit"
              className="bg-primary w-[100px] text-white hover:bg-primary/80 cursor-pointer gap-1"
            >
              <p>次へ</p>
              <ChevronRight size={26} />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CartSectionTwoComponent;
