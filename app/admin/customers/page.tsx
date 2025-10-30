"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import ImageRoundComponent from "@/components/admin/ImageRoundComponent";
import { useChangeCustomerStatus, useCustomers } from "@/hooks/admin/useCustomer";
import PaginationComponent from "@/components/app/PaginationComponent";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertToLocaleDateTime, convertToYen, encryptString, getProfileImage } from "@/utils";
import { Customer } from "@/types/customers";
import { Skeleton } from "@/components/ui/skeleton";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import ProileImage from "@/public/profile/profileDummy.jpg";

const CustomersPage = () => {
  const router = useRouter(); // Router

  const [pageSize] = useState(5); // Page size
  const [page, setPage] = useState(1); // Page
  const [customerNameOrMail, setCustomerNameOrMail] = useState(""); // Customer name or mail
  const [searchCustomerNameOrMail, setSearchCustomerNameOrMail] = useState(""); // Search customer name or mail
  const [status, setStatus] = useState("0"); // Status
  const [searchStatus, setSearchStatus] = useState("0"); // Search status

  const [open, setOpen] = useState(false); // Open
  const [customerId, setCustomerId] = useState<number | string>(""); // Customer ID
  const [statusToChange, setStatusToChange] = useState(false); // Status to change

  // Customers hooks 
  const {
    data: customers,
    isLoading,
    error,
    isError,
    refetch,
  } = useCustomers(page, pageSize, searchCustomerNameOrMail, searchStatus);

  const total = customers?.data?.total || 0; // Total
  const totalPages = Math.ceil(total / pageSize); // Total pages

  // Change customer status hooks
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingCustomerStatus,
  } = useChangeCustomerStatus(customerId, statusToChange);

  // Handle search 
  const handleSearch = () => {
    setPage(1);
    setSearchCustomerNameOrMail(customerNameOrMail);
    setSearchStatus(searchStatus);
    setOpen(false);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus();
  };

  // Error handling
  useEffect(() => {
    // error 
    if (isError) {
      toast.error(error?.message);
    }

    // change status error
    if (changeStatusError) {
      toast.error(changeStatusError?.message);
    }

    // change status success
    if (isSuccess) {
      toast.success(changeStatusData?.data.message);
      refetch();
    }
  }, [isError, error, changeStatusError, isSuccess, changeStatusData, refetch]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between">
          <div className="grid flex-1 gap-1 text-left">
            <h2>お客様一覧</h2>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex justify-between items-center gap-2 mb-1">
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
                  <DialogDescription className="mt-2 space-y-4">
                    {/* お客様名 / メール */}
                    <span className="text-sm">お客様名 / メール</span>
                    <Input
                      value={customerNameOrMail}
                      onChange={(e) => setCustomerNameOrMail(e.target.value)}
                      placeholder="お客様名 / メールを入力"
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
                      <SelectContent className="bg-white border border-white-bg rounded-md">
                        <SelectItem value="0">すべて</SelectItem>
                        <SelectItem value="1">有効</SelectItem>
                        <SelectItem value="2">無効</SelectItem>
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

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[100px] py-4 px-4 font-bold">
                  氏名
                </TableHead>
                <TableHead className="py-4 font-bold">電話番号</TableHead>
                <TableHead className="text-right py-4 font-bold">
                  注文合計金額
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  最終ログイン日時
                </TableHead>
                <TableHead className="text-center py-4 font-bold">
                  ステータス
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.data?.data.map((customer: Customer) => (
                <TableRow
                  className="border-b border-black/10 hover:bg-black/2"
                  key={customer.user_id}
                >
                  <TableCell
                    className="py-4 px-4 flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/customers/${encryptString(customer.user_id)}`)
                    }
                  >
                    <ImageRoundComponent
                      imgURL={
                        customer.user_photo ? getProfileImage(customer.user_photo) : ProileImage
                      }
                      imgName="customer1"
                    />
                    <div className="flex-col">
                      <p className="truncate w-[200px]">{customer.username}</p>
                      <p>{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {customer.phone_number || "N/A"}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {convertToYen(customer.total_order_amount || 0)}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {convertToLocaleDateTime(customer.last_login, "Asia/Tokyo")}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                            customer.is_active
                              ? "bg-tertiary hover:bg-tertiary/80"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                          onClick={() => {
                            setCustomerId(customer.user_id || 0);
                          }}
                        >
                          {customer.is_active ? "有効" : "無効"}
                          <ChevronDown size={15} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                        <DialogHeader>
                          <DialogTitle>ステータス変更</DialogTitle>
                          <DialogDescription className="w-full flex items-center justify-center gap-4 border-y-[1px] border-black/10 py-8 mt-2">
                            <DialogClose
                              className="rounded-md text-xs bg-tertiary text-white cursor-pointer w-[100px] py-2 hover:bg-tertiary/80"
                              onClick={() => {
                                handleStatusChange(true);
                              }}
                            >
                              有効
                            </DialogClose>
                            <DialogClose
                              className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                              onClick={() => {
                                handleStatusChange(false);
                              }}
                            >
                              無効
                            </DialogClose>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              onClick={() => {
                                handleStatusChange(!statusToChange);
                              }}
                              className="text-xs bg-additional text-white cursor-pointer w-[100px] ml-auto hover:bg-additional/80"
                            >
                              OK
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}

              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Skeleton className="w-full h-full bg-white-bg" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && customers?.data && customers?.data?.length > 0 && (
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

      <ServerActionLoadingComponent
        loading={isChangingCustomerStatus}
        message="お客様のステータスを変更中..."
      />
    </section>
  );
};

export default CustomersPage;
