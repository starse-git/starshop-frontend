"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { convertToYen, encryptString, getPublicUrl } from "@/utils";
import { ProductCell } from "@/components/cart/CartSectionOneComponent";
import AddressCard from "@/components/profile/AddressCard";
import { Bike, CreditCard, ClipboardList } from "lucide-react";
import DeliveryCard from "@/components/profile/DeliveryCard";
import OrderCancelSection from "@/components/profile/OrderCancelSection";
import { useParams } from "next/navigation";
import {
  useGetOrderSummaryDetailsByOrderId,
  useUpdateOrderStatus,
} from "@/hooks/user/useOrder";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Product } from "@/types/orders";
import { decryptString } from "@/utils";
import { AxiosError } from "axios";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { cancelOrderMail } from "@/lib/api/user/cancelOrderMailService";
import InvoiceGenerator from "@/components/pdf/invoice-generator";

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams(); // Get order id from url

  const [orderId, setOrderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");

  const { mutate: updateOrderStatus, isPending: updateOrderStatusLoading } =
    useUpdateOrderStatus(); // Update order status

  const {
    data: orderSummary,
    isLoading: orderSummaryLoading,
    error: orderSummaryError,
    isError: orderSummaryIsError,
    refetch: orderSummaryRefetch,
  } = useGetOrderSummaryDetailsByOrderId(Number(orderId || 0)); // Get order summary details

  // Update order status
  const handleUpdateOrderStatus = (status: string, notes: string) => {
    updateOrderStatus(
      {
        orderId: Number(orderId || 0),
        status,
        notes,
      },
      {
        onSuccess: () => {
          toast.success("注文をキャンセルしました。");
          handleCancelOrder(notes);
          orderSummaryRefetch();
          setOpen(false);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(
            err.response?.data.message || "注文をキャンセルできませんでした。"
          );
          setOpen(false);
        },
      }
    );
  };

  // Send cancel order mail
  const handleCancelOrder = async (notes: string) => {
    await cancelOrderMail({
      username:
        orderSummary?.data[0]?.shipping_address?.first_name +
        " " +
        orderSummary?.data[0]?.shipping_address?.last_name,
      orderId: Number(orderId || 0),
      total: orderSummary?.data[0]?.order_total || 0,
      eightPercentTotal: orderSummary?.data[0]?.eight_percent_total || 0,
      tenPercentTotal: orderSummary?.data[0]?.ten_percent_total || 0,
      products: orderSummary?.data[0]?.products || [],
      cancelReason: notes,
    }).then((res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  useEffect(() => {
    if (params.slug) {
      const decryptedOrderId = decryptString(params.slug as string);
      if (decryptedOrderId === null) {
        router.push("/profile");
        return;
      }
      setOrderId(decryptedOrderId);
    }
  }, [params.slug, router]);

  // If error, show error message
  useEffect(() => {
    if (orderSummaryIsError) {
      toast.error(orderSummaryError.message);
    }
  }, [orderSummaryIsError, orderSummaryError]);

  useEffect(() => {
    if (orderSummary?.data[0]?.order_status === "キャンセル済み") {
      setReason(orderSummary?.data[0]?.notes || "");
    }
  }, [orderSummary?.data]);

  return (
    <div className="px-4">
      <div className="bg-white/50 border border-white-bg rounded-md p-4 md:p-6 drop-shadow-xl md:space-y-6 space-y-3">
        {/* Delivery Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <AddressCard
            icon={<Bike size={26} className="text-dark" />}
            title="配送先"
            name={
              orderSummary?.data[0]?.billing_address.first_name +
              " " +
              orderSummary?.data[0]?.billing_address.last_name
            }
            phone={orderSummary?.data[0]?.billing_address.phone || ""}
            zipCode={orderSummary?.data[0]?.billing_address.postal_code || ""}
            address={
              orderSummary?.data[0]?.billing_address.prefecture +
                " " +
                orderSummary?.data[0]?.billing_address.city +
                " " +
                orderSummary?.data[0]?.billing_address.street +
                " " +
                orderSummary?.data[0]?.billing_address.building +
                " " +
                orderSummary?.data[0]?.billing_address.room || ""
            }
          />
          <DeliveryCard
            icon={<CreditCard size={26} className="text-dark" />}
            title="配送状況"
            company={orderSummary?.data[0]?.shipping_company || "-"}
            trackingNumber={orderSummary?.data[0]?.tracking_number || "-"}
            deliveryDate={orderSummary?.data[0]?.shipping_date || "-"}
          />
          <AddressCard
            icon={<ClipboardList size={26} className="text-dark" />}
            title="請求先"
            name={
              orderSummary?.data[0]?.billing_address.first_name +
              " " +
              orderSummary?.data[0]?.billing_address.last_name
            }
            phone={orderSummary?.data[0]?.billing_address.phone || ""}
            zipCode={orderSummary?.data[0]?.billing_address.postal_code || ""}
            address={
              orderSummary?.data[0]?.billing_address.prefecture +
                " " +
                orderSummary?.data[0]?.billing_address.city +
                " " +
                orderSummary?.data[0]?.billing_address.street +
                " " +
                orderSummary?.data[0]?.billing_address.building +
                " " +
                orderSummary?.data[0]?.billing_address.room || ""
            }
            downLoadButton={
              <InvoiceGenerator
                orderData={orderSummary?.data[0]}
                disabled={orderSummaryLoading}
              />
            }
          />
        </div>

        {/* Order Cancel Section */}
        <div className="space-y-2 md:mt-7 mt-5">
          <OrderCancelSection
            orderDate={orderSummary?.data[0]?.order_date || ""}
            paymentMethod={orderSummary?.data[0]?.payment_method || ""}
            open={open}
            setOpen={setOpen}
            isLoading={updateOrderStatusLoading}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            orderStatus={orderSummary?.data[0]?.order_status || ""}
            reason={reason}
            setReason={setReason}
          />

          {/* Order Details Table */}
          <div className="bg-white/50 border border-white-bg rounded-md">
            {/* Desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white-bg">
                    <TableHead className=" px-6 py-4">商品</TableHead>
                    <TableHead className="w-[100] px-6 py-4">
                      価格（税抜）
                    </TableHead>
                    <TableHead className="w-[250px] px-6 py-4">個数</TableHead>
                    <TableHead className="w-[100px] px-6 py-4">
                      合計金額
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!orderSummaryLoading &&
                    orderSummary?.data[0]?.products.map((product: Product) => (
                      <TableRow
                        key={product.product_id}
                        className="border-b border-white-bg"
                      >
                        <TableCell className="px-6 py-4">
                          <ProductCell
                            name={product.product_name}
                            price={product.price}
                            image={
                              product.images[0]
                                ? getPublicUrl(product.images[0])
                                : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            }
                            onClick={() =>
                              router.push(
                                `/products/${encryptString(
                                  product.product_id.toString()
                                )}`
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {convertToYen(product.price)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right px-6 py-4">
                          {convertToYen(product.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  {orderSummaryLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-white-bg"
                      >
                        <TableCell colSpan={4} className="p-4">
                          <Skeleton className="h-[50px] w-full bg-white-bg rounded-md p-2 mt-1" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <div className="">
                {!orderSummaryLoading &&
                  orderSummary?.data[0]?.products.map((product: Product) => (
                    <div
                      key={product.product_id}
                      className="border-b border-white-bg"
                    >
                      <div className="px-3 py-3">
                        <ProductCell
                          name={product.product_name}
                          price={product.price}
                          image={
                            product.images[0]
                              ? getPublicUrl(product.images[0])
                              : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          }
                          onClick={() =>
                            router.push(
                              `/products/${encryptString(
                                product.product_id.toString()
                              )}`
                            )
                          }
                        />
                      </div>
                      <div className="px-3 mb-2 flex justify-between text-sm">
                        <p>個数: {product.quantity}</p>
                        <p>{convertToYen(product.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                {orderSummaryLoading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border-b border-white-bg">
                      <div className="p-4">
                        <Skeleton className="h-[50px] w-full bg-white-bg rounded-md p-2 mt-1" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {!orderSummaryLoading && (
            <div className="md:py-6 md:px-6 py-4 px-2 md:space-y-10 space-y-5">
              <div className="flex justify-between">
                <div className="w-full flex md:justify-end justify-between font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">小計</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(
                        orderSummary?.data[0]?.products.reduce(
                          (total: number, item: Product) =>
                            total + item.subtotal,
                          0
                        ) || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">送料</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(orderSummary?.data[0]?.shipping_cost || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">税金(8%)</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(
                        orderSummary?.data[0]?.eight_percent_total || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">税金(10%)</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(
                        orderSummary?.data[0]?.ten_percent_total || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-2xl">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p>合計</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p>
                      {convertToYen(orderSummary?.data[0]?.order_total || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {orderSummaryLoading && (
            <div className="flex pr-5 gap-4">
              <div className="md:block hidden w-[70%]" />

              <div className="md:w-[30%] w-full flex flex-col gap-5 justify-end font-semibold text-base">
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      <ServerActionLoadingComponent
        loading={updateOrderStatusLoading}
        message="注文状態を更新しています"
      />
    </div>
  );
};

export default OrderDetailsPage;
