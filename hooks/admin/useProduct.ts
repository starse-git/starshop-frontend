import { useMutation, useQuery } from "@tanstack/react-query";
import { Product } from "@/types/products";
import axios from "axios";

/**
 * Use products
 * @param page - Page number
 * @param pageSize - Page size
 * @param productName - Product name
 * @param status - Product status
 * @returns
 * @example
 * const { data, isLoading, error } = useProducts();
 * @author ヤン
 */
export const useProducts = (
  page: number = 1,
  pageSize: number = 10,
  productName: string = "",
  status: string = "",
  brand: string = "",
) => {
  return useQuery({
    queryKey: ["products", page, pageSize, productName, status, brand],
    queryFn: () =>
      axios.get("/api/admin/products", {
        params: {
          page,
          pageSize,
          productName,
          status,
          brand,
        },
      }),
    select: (data) => data.data,
  });
};

/**
 * Use product by id
 * @param productId - Product id
 * @returns
 * @example
 * const { data, isLoading, error } = useProductById(productId);
 * @author ヤン
 */
export const useProductById = (productId: number) => {
  return useQuery({
    queryKey: ["productById", productId],
    queryFn: () => axios.get(`/api/admin/products/${productId}`),
    enabled: !!productId,
    select: (data) => data.data,
  });
};

/**
 * Use change product status
 * @param productId - Product id
 * @param status - Product status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeProductStatus(productId, status);
 * @author ヤン
 */
export const useChangeProductStatus = (productId: number, status: boolean) => {
  return useMutation({
    mutationFn: () => axios.patch(`/api/admin/products/${productId}`, { status }),
  });
};

interface CreateProductInput {
  product: Product;
  recommendProducts: number[];
}

/**
 * Use create product
 * @param product - Product
 * @param recommendProducts - Recommend products
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateProduct({ product, recommendProducts });
 * @author ヤン
 */
export const useCreateProduct = () => {
  return useMutation({
    mutationFn: ({ product, recommendProducts }: CreateProductInput) =>
      axios.post("/api/admin/products/create", { product, recommendProducts }),
  });
};

/**
 * Use update product
 * @param product - Product
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateProduct(product);
 * @author ヤン
 */
export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ product, recommendProducts }: CreateProductInput) =>
      axios.post(`/api/admin/products/update`, {
        product,
        recommendProducts,
      }),
  });
};
