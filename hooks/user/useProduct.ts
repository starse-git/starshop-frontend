import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use top products
 * @param page - Page number
 * @param pageSize - Page size
 * @param productName - Product name
 * @param status - Product status
 * @returns
 * @example
 * const { data, isLoading, error } = useTopProducts();
 * @author ヤン
 */
export const useTopProducts = (
  page: number = 1,
  pageSize: number = 9,
  productName: string = "",
  status: string = "1"
) => {
  return useQuery({
    queryKey: ["top-products", page, pageSize, productName, status],
    queryFn: () =>
      axios.get("/api/products", {
        params: {
          page,
          pageSize,
          productName,
          status,
        },
      }),
    select: (data) => data.data,
  });
};

/**
 * Use products by category
 * @param category_id - Category id
 * @returns
 * @example
 * const { data, isLoading, error } = useProductsByCategory();
 * @author ヤン
 */
export const useProductsByCategory = (
  category_id: string = "all",
  brand_id: string = "all"
) => {
  return useQuery({
    queryKey: ["products-by-category", category_id, brand_id],
    queryFn: () =>
      axios.get("/api/products/by-category", {
        params: {
          category_id,
          brand_id,
        },
      }),
    select: (data) => data.data,
  });
};

/**
 * Use product detail
 * @param productId - Product id
 * @returns
 * @example
 * const { data, isLoading, error } = useProductDetail();
 * @author ヤン
 */
export const useProductDetail = (productId: number) => {
  return useQuery({
    queryKey: ["product-detail", productId],
    queryFn: () => axios.get("/api/products/" + productId),
    select: (data) => data.data,
  });
};
