"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter, CirclePlus, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import ImageCardComponent from "@/components/admin/ImageCardComponent";
import { useProducts } from "@/hooks/admin/useProduct";
import { useChangeProductStatus } from "@/hooks/admin/useProduct";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationComponent from "@/components/app/PaginationComponent";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { encryptString, getPublicUrl } from "@/utils";
import { Product } from "@/types/products";
import { useBrandsList } from "@/hooks/admin/useBrands";
import { BrandList } from "@/types/brands";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";

const ProductsPage = () => {
  const router = useRouter(); // Router for navigation
  const [pageSize] = useState(5); // Number of items per page
  const [page, setPage] = useState(1); // Current page number

  const [productName, setProductName] = useState(""); // Product name for search
  const [searchProductName, setSearchProductName] = useState(""); // Search product name
  const [status, setStatus] = useState("0"); // Product status for search
  const [searchStatus, setSearchStatus] = useState("0"); // Search product status
  const [brand, setBrand] = useState("0"); // Brand for search
  const [searchBrand, setSearchBrand] = useState("0"); // Search brand
  const [open, setOpen] = useState(false); // Dialog open state
  const [productId, setProductId] = useState(0); // Product ID for status change
  const [statusToChange, setStatusToChange] = useState(false); // Status to change

  // Mutation hooks for product status change
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingProductStatus,
  } = useChangeProductStatus(productId, statusToChange);

  // Custom hook to fetch product data
  const {
    data: products,
    isLoading,
    error,
    isError,
    refetch,
  } = useProducts(page, pageSize, searchProductName, searchStatus, searchBrand);

  // Custom hook to fetch brand data
  const { data: brands } = useBrandsList();

  // Calculate total and total pages
  const total = products?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setSearchProductName(productName);
    setSearchStatus(status);
    setSearchBrand(brand);
    setOpen(false);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus();
  };

  // Handle status change
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
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-3 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>商品一覧</h2>
          </div>
          <div className="hover:bg-black/2 cursor-pointer p-2 rounded-[7px] hover:text-black/80">
            <CirclePlus
              className="w-5 h-5"
              onClick={() => router.push("/admin/products/new")}
            />
          </div>
        </div>

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
                    {/* 商品名 */}
                    <span className="text-sm">商品名</span>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="商品名を入力"
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
                        <SelectItem value="1">販売中</SelectItem>
                        <SelectItem value="2">販売停止</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* ブランド */}
                    <span className="text-sm">ブランド</span>
                    <Select
                      value={brand}
                      onValueChange={(value) => setBrand(value)}
                    >
                      <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                        <SelectValue placeholder="ブランドを選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-white-bg rounded-md">
                        <SelectItem value="0">すべて</SelectItem>
                        {brands?.data?.map((brand: BrandList) => (
                          <SelectItem
                            key={brand.brand_id}
                            value={brand.brand_id.toString()}
                          >
                            {brand.name}
                          </SelectItem>
                        ))}
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
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[100px] py-4 px-4 font-bold">商品</TableHead>
                <TableHead className="py-4 font-bold text-left">ブランド</TableHead>
                <TableHead className="py-4 font-bold text-right">卸価格</TableHead>
                <TableHead className="py-4 font-bold text-right">販売価格</TableHead>
                <TableHead className="py-4 font-bold text-right">販売価格(税込)</TableHead>
                <TableHead className="py-4 font-bold text-right">税率</TableHead>
                <TableHead className="py-4 font-bold text-right">在庫</TableHead>
                <TableHead className="py-4 font-bold text-center">状況</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                products?.data?.data?.map((product: Product) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2"
                    key={product.product_id}
                  >
                    <TableCell className="py-4 px-4 flex items-center gap-2">
                      <ImageCardComponent
                        imgURL={getPublicUrl(
                          product.product_images?.[0]?.image_url || ""
                        )}
                        imgName="product1"
                      />
                      <div
                        className="flex-col cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/admin/products/${encryptString(
                              product.product_id?.toString() || ""
                            )}`
                          )
                        }
                      >
                        <p className="truncate w-[200px]">{product.name}</p>
                        <p>#{product.product_id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-left">
                      {product.brand?.name}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      ¥{Number(product.wholesale_price).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      ¥{Number(product.sale_price).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      ¥{Number(Math.floor(product.sale_price + (product.sale_price * product.tax) / 100)).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      {product.tax}%
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      {product.stock_quantity}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${product.is_active
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                              }`}
                            onClick={() => {
                              setProductId(product.product_id || 0);
                            }}
                          >
                            {product.is_active ? "販売中" : "販売停止"}
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
                                販売中
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() => {
                                  handleStatusChange(false);
                                }}
                              >
                                販売停止
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

              {!isLoading && products?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p>商品がありません</p>
                  </TableCell>
                </TableRow>
              )}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Skeleton className="animate-spin" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading &&
          products?.data?.data &&
          products?.data?.data?.length > 0 && (
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
        loading={isChangingProductStatus}
        message="商品のステータスを変更中..."
      />
    </section>
  );
};

export default ProductsPage;
