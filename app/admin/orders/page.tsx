"use client";

import AdminBadgeComponent from "@/components/admin/AdminBadgeComponent";
import ImageCardComponent from "@/components/admin/ImageCardComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { useRouter } from "next/navigation";
import { useGetOrderSummaries } from "@/hooks/admin/useOrder";
import PaginationComponent from "@/components/app/PaginationComponent";
import { toast } from "sonner";
import { convertToLocaleDateTime, convertToYen, encryptString, getProfileImage, getPublicUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummary } from "@/types/orders";
import ImageRoundComponent from "@/components/admin/ImageRoundComponent";
import defaultImage from "@/public/profile/profileDummy.jpg";

const OrdersPage = () => {
  const router = useRouter(); // router

  const [pageSize] = useState(5); // page size
  const [page, setPage] = useState(1); // page

  const [orderDate, setOrderDate] = useState(""); // order date
  const [customerName, setCustomerName] = useState(""); // customer name
  const [status, setStatus] = useState("all"); // status
  const [searchOrderDate, setSearchOrderDate] = useState(""); // search order date
  const [searchCustomerName, setSearchCustomerName] = useState(""); // search customer name
  const [searchStatus, setSearchStatus] = useState("all"); // search status

  // order summaries hooks
  const {
    data: orderSummaryData,
    isLoading: orderSummaryLoading,
    error: orderSummaryError,
    isError: orderSummaryIsError,
  } = useGetOrderSummaries(
    page,
    pageSize,
    searchOrderDate,
    searchCustomerName,
    searchStatus
  );

  const [open, setOpen] = useState(false); // open dialog

  const total = orderSummaryData?.data?.total || 0; // total
  const totalPages = Math.ceil(total / pageSize); // total pages

  // handle search
  const handleSearch = () => {
    setPage(1);
    setSearchOrderDate(orderDate);
    setSearchCustomerName(customerName);
    setSearchStatus(status);
    setOpen(false);
  };

  // error handling
  useEffect(() => {
    if (orderSummaryError && orderSummaryIsError) {
      toast.error(orderSummaryError.message);
    }
  }, [orderSummaryError, orderSummaryIsError]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between">
          <div className="grid flex-1 gap-1 text-left">
            <h2>注文一覧</h2>
          </div>
        </div>
        {/* Filter & Search */}
        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm">{total} 件</p>
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <div className="flex items-center justify-between">
                <DialogTrigger asChild>
                  <div className="hover:bg-black/2 cursor-pointer p-2 rounded-[7px] hover:text-black/80">
                    <ListFilter
                      className="w-5 h-5"
                      onClick={() => setOpen(true)}
                    />
                  </div>
                </DialogTrigger>
              </div>

              <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                <DialogHeader>
                  <DialogTitle>検索</DialogTitle>
                  <DialogDescription className="mt-2 space-y-4">
                    {/* 注文日 */}
                    <span className="text-xs">注文日</span>
                    <AdminDatePicker
                      value={orderDate}
                      onChange={(date) => setOrderDate(date)}
                      styleName="w-full border border-white-bg rounded-md p-2 mt-2 mb-4"
                    />

                    {/* お客様名 */}
                    <span className="text-sm">お客様名</span>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="お客様名を入力"
                      className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    />

                    {/* 状況 */}
                    <span className="text-sm">状況</span>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value)}
                    >
                      <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                        <SelectValue placeholder="状況を選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="保留中">保留中</SelectItem>
                        <SelectItem value="処理中">処理中</SelectItem>
                        <SelectItem value="発送済み">発送済み</SelectItem>
                        <SelectItem value="配送済み">配送済み</SelectItem>
                        <SelectItem value="キャンセル済み">
                          キャンセル済み
                        </SelectItem>
                        <SelectItem value="返品済み">返品済み</SelectItem>
                        <SelectItem value="返金済み">返金済み</SelectItem>
                        <SelectItem value="失敗">失敗</SelectItem>
                        <SelectItem value="完了">完了</SelectItem>
                      </SelectContent>
                    </Select>
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                    onClick={handleSearch}
                  >
                    OK
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Table */}
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
              {!orderSummaryLoading &&
                orderSummaryData?.data?.data?.map((order: OrderSummary) => (
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
                          className={`flex items-center gap-1 ${order.order_items.length > 1 &&
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
                          <div className="flex-col pl-2">
                            <p className="truncate w-[200px]">
                              {item.product_name}
                            </p>
                            <p>
                              {convertToYen(Math.floor(item.sale_price + (item.sale_price * item.tax / 100)))} *{" "}
                              {item.product_quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="py-4">
                      {convertToLocaleDateTime(order.order_date, "Asia/Tokyo")}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <ImageRoundComponent
                          imgURL={
                            order.customer_photo ? getProfileImage(order.customer_photo) : defaultImage.src
                          }
                          className="w-[50px] h-[50px]"
                          imgName="customer1"
                        />
                        {order.customer_name}
                      </div>
                    </TableCell>
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
              {orderSummaryData?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    注文がありません
                  </TableCell>
                </TableRow>
              )}
              {orderSummaryLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Skeleton className="h-24 w-full bg-white-bg rounded-[10px]" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!orderSummaryLoading &&
          orderSummaryData &&
          orderSummaryData?.data?.data?.length > 0 && (
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

export default OrdersPage;
