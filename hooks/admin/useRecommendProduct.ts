import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use get recommend products to choose
 * @param productId - Product id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetRecommendProductsToChoose(productId);
 * @author ヤン
 */
export const useGetRecommendProductsToChoose = (productId?: number) => {
  return useQuery({
    queryKey: ["recommendProductsToChoose", productId],
    queryFn: () => axios.get(`/api/admin/products/recommendations/choose`, {
      params: {
        productId
      }
    }),
    select: (data) => data.data,
    enabled: !!productId,
  });
};

/**
 * Use get recommend products
 * @param productId - Product id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetRecommendProducts(productId);
 * @author ヤン
 */
export const useGetRecommendProducts = (productId?: number) => {
  return useQuery({
    queryKey: ["recommendProducts", productId],
    queryFn: () => axios.get(`/api/admin/products/recommendations/${productId}`),
    select: (data) => data.data,
    enabled: !!productId,
  });
};
