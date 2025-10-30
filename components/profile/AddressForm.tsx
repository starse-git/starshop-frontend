"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import {
  useAddressByPostcode,
  useGetShippingAddress,
  useUpdateShippingAddress,
} from "@/hooks/user/useAddress";
import { Skeleton } from "../ui/skeleton";
import { AxiosError } from "axios";
import { MESSAGES } from "@/types/messages";

const FormSchema = z.object({
  firstName: z.string().min(2, "姓は2文字以上で入力してください"),
  lastName: z.string().min(2, "名は2文字以上で入力してください"),
  phone: z
    .string()
    .min(2, "電話番号は2文字以上で入力してください")
    .regex(/^[0-9]{10,11}$/, "電話番号は10桁または11桁で入力してください"),
  zip: z.string().regex(/^[0-9]{7}$/, "郵便番号は7桁で入力してください"),
  city: z.string().min(2, "郵便番号で検索してください"),
  address: z.string().min(2, "番地は2文字以上で入力してください"),
  building: z.string().optional(),
  room: z.string().optional(),
});

const AddressForm = () => {
  const { data: shippingAddress, isLoading: isShippingAddressLoading } =
    useGetShippingAddress(); // 配送先住所を取得する
  const {
    mutate: updateShippingAddress,
    isPending: isUpdatingShippingAddress,
  } = useUpdateShippingAddress(); // 配送先住所を更新する

  const { mutate: getAddressByPostcode } = useAddressByPostcode(); // 配送先住所を取得する

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
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    handleUpdateShippingAddress(data);
  };

  const handleGetAddressByPostcode = (postcode: string) => {
    getAddressByPostcode(
      { postcode },
      {
        onSuccess: (data) => {
          form.setValue(
            "city",
            data?.data?.city_ward_town + " " + data?.data?.prefecture + " " + data?.data?.address
          );
        },
        onError: (err: Error) => {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };

  const handleUpdateShippingAddress = (data: z.infer<typeof FormSchema>) => {
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
          toast.success(MESSAGES.ADDRESS.UPDATE_SUCCESS);
        },
        onError: (err: Error) => {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };

  useEffect(() => {
    if (shippingAddress) {
      form.reset({
        firstName: shippingAddress.data?.recipient_first_name,
        lastName: shippingAddress.data?.recipient_last_name,
        phone: shippingAddress.data?.recipient_phone_number,
        zip: shippingAddress.data?.postal_code,
        city: shippingAddress.data?.city,
        address: shippingAddress.data?.street_address,
        building: shippingAddress.data?.building_name,
        room: shippingAddress.data?.room_number,
      });
    }
  }, [shippingAddress, form]);

  return (
    <div className="space-y-6 py-4">
      {!isShippingAddressLoading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 md:w-[400px] w-full"
          >
            <div className="w-full flex space-x-3">
              <div className="w-1/2">
                <FormInputComponent
                  control={form.control}
                  name="firstName"
                  label="性"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                />
              </div>
              <div className="w-1/2">
                <FormInputComponent
                  control={form.control}
                  name="lastName"
                  label="名"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                />
              </div>
            </div>
            <FormInputComponent
              control={form.control}
              name="phone"
              label="電話番号"
              type="tel"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />

            <div className="w-full flex space-x-3">
              <div className="w-1/3">
                <FormInputComponent
                  control={form.control}
                  name="zip"
                  label="郵便番号"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                  onBlur={() =>
                    handleGetAddressByPostcode(form.getValues("zip"))
                  }
                />
              </div>
              <div className="w-2/3">
                <FormInputComponent
                  control={form.control}
                  name="city"
                  label="市区町村"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                />
              </div>
            </div>

            <FormInputComponent
              control={form.control}
              name="address"
              label="番地"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />
            <FormInputComponent
              control={form.control}
              name="building"
              label="建物名"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />
            <FormInputComponent
              control={form.control}
              name="room"
              label="部屋番号"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />
            <Button
              type="submit"
              className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
              disabled={isUpdatingShippingAddress}
            >
              {isUpdatingShippingAddress ? "更新中..." : "更新"}
            </Button>
          </form>
        </Form>
      )}
      {isShippingAddressLoading && (
        <Skeleton className="w-[400px] h-[600px] bg-white-bg" />
      )}
    </div>
  );
};

export default AddressForm;
