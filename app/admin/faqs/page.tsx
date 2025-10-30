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
import { ChevronDown, CirclePlus, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { TableHeader } from "@/components/ui/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationComponent from "@/components/app/PaginationComponent";
import { convertToLocaleDateTime, encryptString } from "@/utils";
import { useChangeFaqStatus, useFaqs } from "@/hooks/admin/useFaqs";
import { Faqs } from "@/types/faqs";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";

const FaqsPage = () => {
  const router = useRouter(); // Get the router
  const [pageSize] = useState(5); // Set page size
  const [page, setPage] = useState(1); // Set page

  const [faqsKeyword, setFaqsKeyword] = useState(""); // Set faqs keyword
  const [searchFaqsKeyword, setSearchFaqsKeyword] = useState(""); // Set search faqs keyword
  const [faqsDate, setFaqsDate] = useState(""); // Set faqs date
  const [searchFaqsDate, setSearchFaqsDate] = useState(""); // Set search faqs date
  const [status, setStatus] = useState("0"); // Set status
  const [searchStatus, setSearchStatus] = useState("0"); // Set search status
  const [open, setOpen] = useState(false); // Set open
  const [faqId, setFaqId] = useState(0); // Set faq id
  const [statusToChange, setStatusToChange] = useState(false); // Set status to change

  // Change status mutation
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingFaqStatus,
  } = useChangeFaqStatus(faqId, statusToChange);

  // Get faqs
  const {
    data: faqs,
    isLoading,
    error,
    isError,
    refetch,
  } = useFaqs(page, pageSize, searchFaqsKeyword, searchStatus, searchFaqsDate);

  // Total faqs
  const total = faqs?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setSearchFaqsKeyword(faqsKeyword);
    setSearchFaqsDate(faqsDate);
    setSearchStatus(status);
    setOpen(false);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus();
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }

    if (changeStatusError) {
      toast.error(changeStatusError?.message);
    }

    if (isSuccess) {
      toast.success(changeStatusData?.data?.message);
      refetch();
    }
  }, [isError, error, changeStatusError, isSuccess, changeStatusData, refetch]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>FAQ一覧</h2>
          </div>
          <div className="hover:bg-black/2 cursor-pointer p-2 rounded-[7px] hover:text-black/80">
            <CirclePlus
              className="w-5 h-5"
              onClick={() => router.push("/admin/faqs/new")}
            />
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
                    {/* 日付 */}
                    <span className="text-xs">日付</span>
                    <AdminDatePicker
                      value={faqsDate}
                      onChange={(date) => setFaqsDate(date)}
                      styleName="w-full border border-white-bg rounded-md p-2 mt-2 mb-4"
                    />

                    {/* FAQキーワード */}
                    <span className="text-sm">FAQキーワード</span>
                    <Input
                      value={faqsKeyword}
                      onChange={(e) => setFaqsKeyword(e.target.value)}
                      placeholder="FAQキーワードを入力"
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
                  日付
                </TableHead>
                <TableHead className="py-4 font-bold">内容</TableHead>
                <TableHead className="text-center py-4 font-bold">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs?.data &&
                faqs?.data?.data?.length > 0 &&
                faqs?.data?.data?.map((faq: Faqs) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    key={faq.faqs_id}
                  >
                    <TableCell
                      className="py-4 px-4 cursor-pointer"
                      onClick={() => router.push(`/admin/faqs/${encryptString(faq.faqs_id.toString())}`)}
                    >
                      {convertToLocaleDateTime(faq.created_at, "Asia/Tokyo")}
                    </TableCell>
                    <TableCell
                      className="py-4 cursor-pointer"
                      onClick={() => router.push(`/admin/faqs/${encryptString(faq.faqs_id.toString())}`)}
                    >
                      {faq.question}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              faq.is_active
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              setFaqId(faq.faqs_id || 0);
                            }}
                          >
                            {faq.is_active ? "有効" : "無効"}
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
              {!isLoading && faqs?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    FAQがありません
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={3} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && faqs?.data && faqs?.data?.data?.length > 0 && (
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
        loading={isChangingFaqStatus}
        message="FAQの状況を変更しています"
      />
    </section>
  );
};

export default FaqsPage;
