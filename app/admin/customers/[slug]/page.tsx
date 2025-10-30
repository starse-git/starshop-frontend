"use client";

import { ArrowLeft, Bike, ReceiptText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import ImageCardComponent from "@/components/admin/ImageCardComponent";
import AdminBadgeComponent from "@/components/admin/AdminBadgeComponent";
import ImageRoundComponent from "@/components/admin/ImageRoundComponent";
import {
  useGetCustomerById,
  useGetOrderSummaryByCustomerId,
  useGetCustomerAddressById,
} from "@/hooks/admin/useCustomer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationComponent from "@/components/app/PaginationComponent";
import { convertToLocaleDateTime, convertToYen, decryptString, encryptString, getProfileImage, getPublicUrl } from "@/utils";
import { OrderSummary } from "@/types/orders";

const CustomerDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [customerId, setCustomerId] = useState<number | string>("");

  const [pageSize] = useState(5);
  const [page, setPage] = useState(1);

  const {
    data: customerData,
    isLoading: customerLoading,
    error: customerError,
    isError: customerIsError,
  } = useGetCustomerById(customerId);

  const {
    data: customerAddressData,
    isLoading: customerAddressLoading,
    error: customerAddressError,
    isError: customerAddressIsError,
  } = useGetCustomerAddressById(customerId);

  const {
    data: orderSummaryData,
    isLoading: orderSummaryLoading,
    error: orderSummaryError,
    isError: orderSummaryIsError,
  } = useGetOrderSummaryByCustomerId(customerId, page, pageSize);

  const total = orderSummaryData?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (params.slug) {
      const decryptCustomerId = decryptString(params.slug as string);
      setCustomerId(decryptCustomerId);
    }
  }, [params.slug]);

  useEffect(() => {
    if (customerError && customerIsError) {
      toast.error(customerError.message);
    }
    if (customerAddressError && customerAddressIsError) {
      toast.error(customerAddressError.message);
    }
    if (orderSummaryError && orderSummaryIsError) {
      toast.error(orderSummaryError.message);
    }
  }, [
    customerError,
    customerIsError,
    customerAddressError,
    customerAddressIsError,
    orderSummaryError,
    orderSummaryIsError,
  ]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between mb-5">
          <div className="grid flex-1 gap-1 text-left">
            <ArrowLeft size={20} onClick={() => router.back()} />
          </div>
        </div>
        {/* 配送先 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!customerLoading && !customerIsError && (
            <div className="flex flex-col h-full p-4 md:p-7 bg-white-bg rounded-[10px] tracking-wider">
              <div className="flex flex-col gap-2">
                <ImageRoundComponent
                  imgURL={
                    customerData?.data?.user_photo
                      ? getProfileImage(customerData?.data?.user_photo)
                      : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  imgName="customer1"
                />
                <p className="text-normal text-dark">
                  {customerData?.data?.username}
                </p>
                <p className="text-normal text-dark">{customerData?.data?.email}</p>
              </div>
            </div>
          )}
          {customerLoading && (
            <Skeleton className="w-full h-[200px] rounded-[10px] bg-black/10" />
          )}
          {!customerAddressLoading && !customerAddressIsError && (
            <div className="flex flex-col h-full p-4 md:p-7 bg-white-bg rounded-[10px] tracking-wider">
              <div className="flex items-center gap-2">
                <Bike size={26} />
                <h3 className="font-bold text-dark">配送先</h3>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <h2 className="text-normal text-dark">
                  {customerAddressData?.data?.[0]?.recipient_first_name || ""}{" "}
                  {customerAddressData?.data?.[0]?.recipient_last_name || ""}
                </h2>
                <p className="text-normal text-dark">
                  {customerAddressData?.data?.[0]?.recipient_phone_number || ""}
                </p>
                <p className="text-normal text-dark">
                  {customerAddressData?.data?.[0]?.postal_code || ""}
                  <br />
                  {customerAddressData?.data?.[0]?.prefecture || ""}{" "}
                  {customerAddressData?.data?.[0]?.city || ""}{" "}
                  {customerAddressData?.data?.[0]?.street_address || ""}
                </p>
              </div>
            </div>
          )}
          {customerAddressLoading && (
            <Skeleton className="w-full h-[200px] rounded-[10px] bg-black/10" />
          )}
          {!customerAddressLoading && !customerAddressIsError && (
            <div className="flex flex-col h-full p-4 md:p-7 bg-white-bg rounded-[10px] tracking-wider">
              <div className="flex items-center gap-2">
                <ReceiptText size={26} />
                <h3 className="font-bold text-dark">請求先</h3>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <h2 className="text-normal text-dark">
                  {customerAddressData?.data?.[1]?.recipient_first_name || ""}{" "}
                  {customerAddressData?.data?.[1]?.recipient_last_name || ""}
                </h2>
                <p className="text-normal text-dark">
                  {customerAddressData?.data?.[1]?.recipient_phone_number || ""}
                </p>
                <p className="text-normal text-dark">
                  {customerAddressData?.data?.[1]?.postal_code || ""}
                  <br />
                  {customerAddressData?.data?.[1]?.prefecture || ""}{" "}
                  {customerAddressData?.data?.[1]?.city || ""}{" "}
                  {customerAddressData?.data?.[1]?.street_address || ""}
                </p>
              </div>
            </div>
          )}
          {customerAddressLoading && (
            <Skeleton className="w-full h-[200px] rounded-[10px] bg-black/10" />
          )}
        </div>

        {/* 注文内容 */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[100px] py-4 px-4 font-bold">
                  注文内容
                </TableHead>
                <TableHead className="py-4 font-bold">注文日時</TableHead>
                <TableHead className="text-left py-4 font-bold">
                  お客様
                </TableHead>
                <TableHead className="text-center py-4 font-bold">
                  状況
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  送料
                </TableHead>
                <TableHead className="text-right py-4 px-4 font-bold">
                  合計金額
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderSummaryData && orderSummaryData?.data?.data?.length > 0 && orderSummaryData?.data?.data?.map((order: OrderSummary) => (
                <TableRow
                  className="border-b border-black/10 hover:bg-black/2"
                  key={order.order_id}
                >
                  <TableCell
                    className="py-4 px-4 cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/orders/${encryptString(order.order_id.toString())}`)
                    }
                  >
                    {order.order_items.map((item, index) => (
                      <div
                        className={`flex items-center gap-1 ${
                          order.order_items.length > 1 &&
                          index !== order.order_items.length - 1
                            ? "mb-2"
                            : ""
                        }`}
                        key={item.product_id}
                      >
                        <ImageCardComponent
                          imgURL={getPublicUrl(item.product_images[0])}
                          imgName="product1"
                        />
                        <div className="flex-col">
                          <p className="truncate w-[200px]">
                            {item.product_name}
                          </p>
                          <p>
                            {convertToYen(item.sale_price + (item.sale_price * item.tax / 100))} *{" "}
                            {item.product_quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="py-4">
                    {convertToLocaleDateTime(order.order_date, "Asia/Tokyo")}
                  </TableCell>
                  <TableCell className="py-4">{order.customer_name}</TableCell>
                  <TableCell className="text-center py-4">
                    <AdminBadgeComponent
                      label={order.order_status}
                      isLink={false}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {convertToYen(order.shipping_cost)}
                  </TableCell>
                  <TableCell className="text-right px-4">
                    {convertToYen(order.order_total)}
                  </TableCell>
                </TableRow>
              ))}
              {orderSummaryLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Skeleton className="w-full h-full bg-black/10" />
                  </TableCell>
                </TableRow>
              )}
              {orderSummaryData?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-center">注文履歴がありません</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!orderSummaryLoading &&
          orderSummaryData &&
          orderSummaryData?.data?.length > 0 && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default CustomerDetailPage;
