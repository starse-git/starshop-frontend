"use client";

import { Bike, CreditCard, ReceiptText } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import ImageCardComponent from "@/components/admin/ImageCardComponent";
import {
  useGetOrderSummaryDetailsByOrderId,
  useUpdateShippingTrackingNumber,
  useUpdateOrderStatus,
} from "@/hooks/admin/useOrder";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  convertToLocaleDateTime,
  convertToYen,
  decryptString,
  getPublicUrl,
} from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderStatus } from "@/data/order/indes";
import { Product } from "@/types/orders";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { sendShippingNotificationMail } from "@/lib/api/admin/sendShippingMailService";
import AdminDatePicker from "@/components/admin/AdminDatePicker";

const FormSchema = z.object({
  shipping_company: z.string().min(1, "配達会社は必須です"),
  tracking_number: z.string().min(1, "追跡番号は必須です"),
  shipping_date: z.string().min(1, "配達日は必須です"),
});

const OrdersPage = () => {
  const params = useParams(); // params

  const [orderId, setOrderId] = useState<number | null>(null); // order id

  // Get order details
  const {
    data: orderDetails,
    isLoading,
    error,
    isError,
    refetch: refetchOrderDetails,
  } = useGetOrderSummaryDetailsByOrderId(orderId || 0);

  // Update shipping tracking number
  const {
    mutate: updateShippingTrackingNumber,
    isPending: updateShippingTrackingNumberLoading,
  } = useUpdateShippingTrackingNumber();

  // Update order status
  const { mutate: updateOrderStatus, isPending: updateOrderStatusLoading } =
    useUpdateOrderStatus();

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      shipping_company: "",
      tracking_number: "",
      shipping_date: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updateShippingTrackingNumber(
      {
        orderId: orderId || 0,
        trackingNumber: data.tracking_number,
        shippingCompany: data.shipping_company,
        shippingDate: data.shipping_date,
        status: "配送済み",
      },
      {
        onSuccess: () => {
          toast.success("配達状況を更新しました");
          const mailBody = {
            orderId: orderId || 0,
            userName:
              orderDetails?.data?.[0].shipping_address.first_name +
              " " +
              orderDetails?.data?.[0].shipping_address.last_name,
            userEmail: orderDetails?.data?.[0].customer_mail,
            products: orderDetails?.data?.[0].products,
            trackingNumber: data.tracking_number,
            carrier: data.shipping_company,
            shippingDate: convertToLocaleDateTime(
              new Date().toISOString(),
              "Asia/Tokyo"
            ),
            shippingAddress:
              orderDetails?.data?.[0].shipping_address.postal_code +
              " " +
              orderDetails?.data?.[0].shipping_address.city +
              " " +
              orderDetails?.data?.[0].shipping_address.street +
              " " +
              orderDetails?.data?.[0].shipping_address.building,
          };
          sendShippingNotificationMail(mailBody).then((res) => {
            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
          });
          refetchOrderDetails();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleUpdateOrderStatus = (status: string) => {
    updateOrderStatus(
      {
        orderId: orderId || 0,
        status: status,
      },
      {
        onSuccess: () => {
          toast.success("注文状態を更新しました");
          refetchOrderDetails();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (params.slug) {
      const decryptedOrderId = decryptString(params.slug as string);
      setOrderId(Number(decryptedOrderId));
    }
  }, [params.slug]);

  useEffect(() => {
    if (error && isError) {
      toast.error(error.message);
    }
    if (orderDetails) {
      form.setValue(
        "shipping_company",
        orderDetails?.data?.[0].shipping_company || ""
      );
      form.setValue(
        "tracking_number",
        orderDetails?.data?.[0].tracking_number || ""
      );
      form.reset({
        shipping_company: orderDetails?.data?.[0].shipping_company || "",
        tracking_number: orderDetails?.data?.[0].tracking_number || "",
        shipping_date: orderDetails?.data?.[0].shipping_date || "",
      });
    }
  }, [error, isError, form, orderDetails]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        {/* 配送先 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!isLoading && orderDetails && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <div className="flex items-center gap-2">
                <Bike size={26} />
                <h3 className="font-bold text-dark">配送先</h3>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <h2 className="text-normal text-dark">
                  {orderDetails?.data?.[0].billing_address.first_name}{" "}
                  {orderDetails?.data?.[0].billing_address.last_name}
                </h2>
                <p className="text-normal text-dark">
                  {orderDetails?.data?.[0].billing_address.phone}
                </p>
                <p className="text-normal text-dark">
                  〒{orderDetails?.data?.[0].billing_address.postal_code}
                  <br />
                  {orderDetails?.data?.[0].billing_address.prefecture}
                  {orderDetails?.data?.[0].billing_address.city}
                  {orderDetails?.data?.[0].billing_address.street}
                </p>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <Skeleton className="h-[25px] w-full bg-white border border-white rounded-md p-2 mt-1" />
            </div>
          )}
          <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
            <div className="flex items-center gap-2">
              <CreditCard size={26} />
              <h3 className="font-bold text-dark">配達状況</h3>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 mt-5"
              >
                <Controller
                  control={form.control}
                  name="shipping_company"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[5px] p-2">
                        {orderDetails?.data?.[0].shipping_company === "yamato" || orderDetails?.data?.[0].shipping_company === "sagawa" || orderDetails?.data?.[0].shipping_company === "japanpost" ? (
                          <SelectValue placeholder={orderDetails?.data?.[0].shipping_company==="yamato" ? "ヤマト" : orderDetails?.data?.[0].shipping_company==="sagawa" ? "佐川" : orderDetails?.data?.[0].shipping_company==="japanpost" ? "日本郵便" : ""} />
                        ) : (
                          <SelectValue placeholder="配達会社を選択してください" />
                        )}
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-black/10 rounded-[5px]">
                        <SelectItem value="yamato" defaultChecked={field.value === "yamato"}>ヤマト</SelectItem>
                        <SelectItem value="sagawa" defaultChecked={field.value === "sagawa"}>佐川</SelectItem>
                        <SelectItem value="japanpost" defaultChecked={field.value === "japanpost"}>日本郵便</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.shipping_company && (
                  <p className="text-xs text-[#FF0000]">
                    {form.formState.errors.shipping_company?.message}
                  </p>
                )}
                <FormInputComponent
                  control={form.control}
                  label=""
                  name="tracking_number"
                  type="text"
                  placeholder="追跡番号"
                  className="bg-white text-xs"
                />
                <Controller
                  control={form.control}
                  name="shipping_date"
                  render={({ field }) => (
                    <AdminDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      styleName="w-full border border-white rounded-md p-2 bg-white"
                    />
                  )}
                />
                {form.formState.errors.shipping_date && (
                  <p className="text-xs text-[#FF0000]">
                    {form.formState.errors.shipping_date?.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="py-2 bg-black text-white-bg px-5 rounded-md mt-1 text-xs cursor-pointer hover:bg-black/80 disabled:bg-black/50"
                  disabled={updateShippingTrackingNumberLoading}
                >
                  {updateShippingTrackingNumberLoading
                    ? "更新中..."
                    : "配達済みにする"}
                </Button>
              </form>
            </Form>
          </div>
          {!isLoading && orderDetails && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <div className="flex items-center gap-2">
                <ReceiptText size={26} />
                <h3 className="font-bold text-dark">請求先</h3>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <h2 className="text-normal text-dark">
                  {orderDetails?.data?.[0].billing_address.first_name}{" "}
                  {orderDetails?.data?.[0].billing_address.last_name}
                </h2>
                <p className="text-normal text-dark">
                  {orderDetails?.data?.[0].billing_address.phone}
                </p>
                <p className="text-normal text-dark">
                  〒{orderDetails?.data?.[0].billing_address.postal_code}
                  <br />
                  {orderDetails?.data?.[0].billing_address.prefecture}
                  {orderDetails?.data?.[0].billing_address.city}
                  {orderDetails?.data?.[0].billing_address.street}
                </p>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <Skeleton className="h-[25px] w-full bg-white border border-white rounded-md p-2 mt-1" />
            </div>
          )}
        </div>

        {/* 注文商品 */}
        <div className="flex flex-wrap items-center justify-between mt-10 md:mt-0 mb-5 md:mb-2 gap-2">
          <p className="text-normal text-dark">
            注文日時：
            {convertToLocaleDateTime(
              orderDetails?.data?.[0].order_date || "",
              "Asia/Tokyo"
            )}
          </p>
          <Select
            value={orderDetails?.data?.[0].order_status}
            onValueChange={(value) => handleUpdateOrderStatus(value)}
            disabled={updateOrderStatusLoading}
          >
            <SelectTrigger className="w-full md:w-[180px] border border-black/10">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-black/10">
              {orderStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="py-4 px-4 font-bold text-left">
                  商品
                </TableHead>
                <TableHead className="py-4 font-bold text-right">
                  価格（税抜）
                </TableHead>
                <TableHead className="py-4 font-bold text-center">
                  数量
                </TableHead>
                <TableHead className="py-4 font-bold text-right">
                  小計（税抜）
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                orderDetails?.data?.[0]?.products?.map((item: Product) => (
                  <TableRow
                    className="border-b border-black/10"
                    key={item.product_id}
                  >
                    <TableCell className="py-4 px-4">
                      <div className={`flex items-center gap-1`}>
                        <ImageCardComponent
                          imgURL={getPublicUrl(item.images[0])}
                          imgName="product1"
                        />
                        <div className="flex-col">{item.product_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-right">
                      {convertToYen(item.price)}
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {convertToYen(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading &&
                Array.from({ length: 3 }, (_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={4} className="h-24">
                      <Skeleton className="h-full w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end w-full">
          {!isLoading && (
            <div className="flex flex-col pr-5 gap-4">
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">小計</div>
                <div className="text-right">
                  {convertToYen(
                    orderDetails?.data?.[0]?.products.reduce(
                      (total: number, item: Product) => total + item.subtotal,
                      0
                    ) || 0
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">送料</div>
                <div className="text-right">
                  {convertToYen(orderDetails?.data?.[0].shipping_cost || 0)}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">税金(8%)</div>
                <div className="text-right">
                  {convertToYen(
                    orderDetails?.data?.[0].eight_percent_total || 0
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">税金(10%)</div>
                <div className="text-right">
                  {convertToYen(orderDetails?.data?.[0].ten_percent_total || 0)}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">合計</div>
                <div className="text-right">
                  {convertToYen(orderDetails?.data?.[0].order_total || 0)}
                </div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col pr-5 gap-4">
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
            </div>
          )}
        </div>
      </div>

      <ServerActionLoadingComponent
        loading={
          updateShippingTrackingNumberLoading || updateOrderStatusLoading
        }
        message={
          updateShippingTrackingNumberLoading
            ? "配達状況を更新しています"
            : "注文状態を更新しています"
        }
      />
    </section>
  );
};

export default OrdersPage;
