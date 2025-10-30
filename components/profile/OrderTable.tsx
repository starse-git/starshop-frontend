"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  convertToLocaleDateTime,
  convertToYen,
  encryptString,
  getPublicUrl,
} from "@/utils";
import { ListFilter } from "lucide-react";
import PaginationComponent from "../app/PaginationComponent";
import { useRouter } from "next/navigation";
import { useGetOrderSummaries } from "@/hooks/user/useOrder";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import StatusBadgeComponent from "@/components/app/StatusBadgeComponent";
import { OrderSummary } from "@/types/orders";
import { cn } from "@/lib/utils";

// Image card component props
interface ImageCardComponentProps {
  imgURL: string;
  imgName: string;
  className?: string;
}

// Image card component
const ImageCardComponent = ({
  imgURL,
  imgName,
  className,
}: ImageCardComponentProps) => {
  return (
    <div
      className={cn(
        "bg-white-bg flex items-center justify-center overflow-hidden w-[80px] h-[80px] border border-black/10",
        className
      )}
    >
      <Image
        src={imgURL}
        alt={imgName}
        width={80}
        height={80}
        className="object-contain"
      />
    </div>
  );
};

const OrderTable = () => {
  const router = useRouter(); // Router
  const [pageSize] = useState(5); // Page size
  const [page, setPage] = useState(1); // Page

  const [orderDate, setOrderDate] = useState(""); // Order date
  const [status, setStatus] = useState("all"); // Status
  const [searchOrderDate, setSearchOrderDate] = useState(""); // Search order date
  const [searchStatus, setSearchStatus] = useState("all"); // Search status

  const [open, setOpen] = useState(false); // Open dialog

  // Get order summaries
  const {
    data: orderSummaryData,
    isLoading: orderSummaryLoading,
    error: orderSummaryError,
    isError: orderSummaryIsError,
  } = useGetOrderSummaries(page, pageSize, searchOrderDate, searchStatus);

  // Total orders
  const total = orderSummaryData?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setSearchOrderDate(orderDate);
    setSearchStatus(status);
    setOpen(false);
  };

  // Error handling
  useEffect(() => {
    if (orderSummaryError && orderSummaryIsError) {
      toast.error(orderSummaryError.message);
    }
  }, [orderSummaryError, orderSummaryIsError]);

  return (
    <div>
      <div className="flex items-center justify-between px-2 py-2">
        <p className="text-sm">{total}件</p>
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
                <DialogDescription className="mt-2 justify-content-start items-start flex flex-col">
                  {/* 注文日 */}
                  <span className="text-left">注文日</span>
                  <AdminDatePicker
                    value={orderDate}
                    onChange={(date) => setOrderDate(date)}
                    styleName="w-full border border-white-bg rounded-md mt-2 p-2 mb-4"
                  />

                  {/* 状況 */}
                  <span className="text-left">状況</span>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                      <SelectValue placeholder="状況を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-white-bg rounded-md">
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
      <div className="border border-white-bg rounded-md bg-white/50">
        {/* Desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white-bg">
                <TableHead className=" px-6 py-4">注文内容</TableHead>
                <TableHead className="w-[150px] px-6 py-4">注文日時</TableHead>
                <TableHead className="w-[150px] px-6 py-4">状況</TableHead>
                <TableHead className="w-[100px] px-6 py-4">送料</TableHead>
                <TableHead className="w-[100px] text-right px-6 py-4">
                  合計金額
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!orderSummaryLoading &&
                orderSummaryData?.data?.data.map((order: OrderSummary) => (
                  <TableRow
                    key={order.order_id}
                    className="border-b border-white-bg"
                  >
                    <TableCell
                      className="px-6 py-4 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/profile/${encryptString(order.order_id.toString())}`
                        )
                      }
                    >
                      {order.order_items.map((item, index) => (
                        <div
                          className={`flex items-center space-y-4 space-x-4 ${
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
                              {convertToYen(
                                Math.floor(
                                  item.sale_price +
                                    (item.sale_price * item.tax) / 100
                                )
                              )}{" "}
                              * {item.product_quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {convertToLocaleDateTime(order.order_date, "Asia/Tokyo")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <StatusBadgeComponent
                        label={order.order_status}
                        isLink={false}
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {convertToYen(order.shipping_cost)}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4">
                      {convertToYen(order.order_total)}
                    </TableCell>
                  </TableRow>
                ))}
              {/* No orders found */}
              {orderSummaryData?.data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    注文がありません
                  </TableCell>
                </TableRow>
              )}
              {/* Loading */}
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
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {!orderSummaryLoading &&
          orderSummaryData?.data?.data.map((order: OrderSummary) => (
            <div
              key={order.order_id}
              className="bg-white/50 border border-white-bg rounded-md p-4 mb-4 text-xs space-y-2"
              onClick={() =>
                router.push(
                  `/profile/${encryptString(order.order_id.toString())}`
                )
              }
            >
              <div className="flex items-center mb-4 justify-between">
                <div>
                  {convertToLocaleDateTime(order.order_date, "Asia/Tokyo")}
                </div>
                <StatusBadgeComponent
                  label={order.order_status}
                  isLink={false}
                />
              </div>
              <div>
                {order.order_items.map((item, index) => (
                  <div
                    className={`flex items-center ${
                      order.order_items.length > 1 &&
                      index !== order.order_items.length - 1
                        ? "mb-2"
                        : "mb-0"
                    }`}
                    key={item.product_id}
                  >
                    <ImageCardComponent
                      imgURL={getPublicUrl(item.product_images[0])}
                      imgName="product1"
                      className="w-[60px] h-[60px]"
                    />
                    <div className="flex-col ml-2">
                      <p className="truncate">{item.product_name}</p>
                      <p>
                        {convertToYen(
                          Math.floor(
                            item.sale_price + (item.sale_price * item.tax) / 100
                          )
                        )}{" "}
                        * {item.product_quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>合計金額</div>
                <div>{convertToYen(order.order_total)}</div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!orderSummaryLoading &&
        orderSummaryData &&
        orderSummaryData?.data?.data.length > 0 && (
          <div className="flex justify-end pt-8">
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
  );
};

export default OrderTable;
