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
import { convertToLocaleDateTime } from "@/utils";
import {
  useChangeBrandStatus,
  useBrands,
  useCreateBrand,
  useUpdateBrand,
} from "@/hooks/admin/useBrands";
import { Brand } from "@/types/brands";
import { AxiosError } from "axios";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";

const BrandsPage = () => {
  const [pageSize] = useState(5); // Page size
  const [page, setPage] = useState(1); // Current page

  const [brandsKeyword, setBrandsKeyword] = useState(""); // Brands keyword
  const [searchBrandsKeyword, setSearchBrandsKeyword] = useState(""); // Search brands keyword
  const [brandsDate, setBrandsDate] = useState(""); // Brands date
  const [searchBrandsDate, setSearchBrandsDate] = useState(""); // Search brands date
  const [status, setStatus] = useState("0"); // Status
  const [searchStatus, setSearchStatus] = useState("0"); // Search status
  const [open, setOpen] = useState(false); // Open filter
  const [brandId, setBrandId] = useState(0); // Brand id
  const [statusToChange, setStatusToChange] = useState(false); // Status to change

  const [openNewBrand, setOpenNewBrand] = useState(false); // Open new brand
  const [newBrandName, setNewBrandName] = useState(""); // New brand name

  const [openUpdateBrand, setOpenUpdateBrand] = useState(false); // Open update brand
  const [updateBrandName, setUpdateBrandName] = useState(""); // Update brand name
  const [updateBrandId, setUpdateBrandId] = useState(0); // Update brand id

  // Mutations for brand status change
  const { mutate: changeStatus, isPending: changeStatusLoading } =
    useChangeBrandStatus();

  // useBrands hook for fetching brands
  const {
    data: brands,
    isLoading,
    error,
    isError,
    refetch,
  } = useBrands(
    page,
    pageSize,
    searchBrandsKeyword,
    searchStatus,
    searchBrandsDate
  );

  // Mutations for brand creation
  const { mutate: createBrand, isPending: isCreatingBrand } = useCreateBrand();

  // Mutations for brand update
  const { mutate: updateBrand, isPending: isUpdatingBrand } = useUpdateBrand();

  // Total number of brands
  const total = brands?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Handle search brands
  const handleSearch = () => {
    setPage(1);
    setSearchBrandsKeyword(brandsKeyword);
    setSearchBrandsDate(brandsDate);
    setSearchStatus(status);
    setOpen(false);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus(
      { brandId, status: productStatus },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      }
    );
  };

  // Handle create brand
  const handleCreateBrand = () => {
    if (!newBrandName) {
      toast.error("ブランド名を入力してください");
      return;
    }
    createBrand(
      { name: newBrandName },
      {
        onSuccess: () => {
          setOpenNewBrand(false);
          setNewBrandName("");
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      }
    );
  };

  // Handle update brand
  const handleUpdateBrand = () => {
    if (!updateBrandName) {
      toast.error("ブランド名を入力してください");
      return;
    }
    updateBrand(
      { name: updateBrandName, brand_id: updateBrandId },
      {
        onSuccess: () => {
          setOpenUpdateBrand(false);
          setUpdateBrandName("");
          setUpdateBrandId(0);
          refetch();
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(err?.response?.data?.message);
        },
      }
    );
  };

  // Error handling
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }
  }, [isError, error]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>ブランド一覧</h2>
          </div>
          <div className="hover:bg-black/2 cursor-pointer p-2 rounded-[7px] hover:text-black/80">
            <CirclePlus
              className="w-5 h-5"
              onClick={() => setOpenNewBrand(true)}
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
                    {/* ブランドキーワード */}
                    <span className="text-sm">ブランドキーワード</span>
                    <Input
                      value={brandsKeyword}
                      onChange={(e) => setBrandsKeyword(e.target.value)}
                      placeholder="ブランドキーワードを入力"
                      className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    />

                    {/* 日付 */}
                    <span className="text-xs">日付</span>
                    <AdminDatePicker
                      value={brandsDate}
                      onChange={(date) => setBrandsDate(date)}
                      styleName="w-full border border-white-bg rounded-md p-2 mt-2 mb-4"
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
                <TableHead className="py-4 font-bold">日付</TableHead>
                <TableHead className="py-4 font-bold">ブランド名</TableHead>
                <TableHead className="py-4 font-bold">商品数</TableHead>
                <TableHead className="text-center py-4 font-bold">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands?.data &&
                brands?.data?.data?.length > 0 &&
                brands?.data?.data?.map((brand: Brand) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    key={brand.brand_id}
                  >
                    <TableCell
                      className="py-4 cursor-pointer"
                      onClick={() => {
                        setOpenUpdateBrand(true);
                        setUpdateBrandId(brand.brand_id);
                        setUpdateBrandName(brand.name);
                      }}
                    >
                      {convertToLocaleDateTime(brand.created_at, "Asia/Tokyo")}
                    </TableCell>
                    <TableCell
                      className="py-4 cursor-pointer"
                      onClick={() => {
                        setOpenUpdateBrand(true);
                        setUpdateBrandId(brand.brand_id);
                        setUpdateBrandName(brand.name);
                      }}
                    >
                      {brand.name}
                    </TableCell>
                    <TableCell className="py-4">
                      {brand.products?.length || 0}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              brand.is_active
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              setBrandId(brand.brand_id || 0);
                            }}
                          >
                            {brand.is_active ? "有効" : "無効"}
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
              {!isLoading && brands?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    FAQがありません
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={4} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && brands?.data && brands?.data?.data?.length > 0 && (
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

      {/* Create new brand dialog */}
      <Dialog open={openNewBrand} onOpenChange={setOpenNewBrand}>
        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
          <DialogHeader>
            <DialogTitle>新規ブランド</DialogTitle>
            <DialogDescription className="mt-2 space-y-4">
              {/* ブランド名 */}
              <span className="text-sm">ブランド名</span>
              <Input
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="ブランド名を入力"
                className="mt-2 text-sm border border-white-bg rounded-md p-2"
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
              onClick={handleCreateBrand}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update brand dialog */}
      <Dialog open={openUpdateBrand} onOpenChange={setOpenUpdateBrand}>
        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
          <DialogHeader>
            <DialogTitle>更新ブランド</DialogTitle>
            <DialogDescription className="mt-2 space-y-4">
              {/* ブランド名 */}
              <span className="text-sm">ブランド名</span>
              <Input
                value={updateBrandName}
                onChange={(e) => setUpdateBrandName(e.target.value)}
                placeholder="ブランド名を入力"
                className="mt-2 text-sm border border-white-bg rounded-md p-2"
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
              onClick={handleUpdateBrand}
            >
              {isUpdatingBrand ? "更新中..." : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ServerActionLoadingComponent
        loading={changeStatusLoading || isUpdatingBrand || isCreatingBrand}
        message={
          changeStatusLoading
            ? "ブランドの状況を変更しています"
            : isUpdatingBrand
              ? "ブランドを更新しています"
              : "ブランドを登録しています"
        }
      />
    </section>
  );
};

export default BrandsPage;
