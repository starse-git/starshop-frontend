import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use brands list
 * @returns Brands list
 * @example
 * const { data, isLoading, error } = useBrandsList();
 * @author ヤン
 */
export const useBrandsList = () => {
  return useQuery({
    queryKey: ["brandsList"],
    queryFn: () => axios.get("/api/admin/brands/list"),
    select: (data) => data.data,
  });
};

/**
 * Use brands
 * @param page - Page number
 * @param pageSize - Page size
 * @param keyword - Brand keyword
 * @param status - Brand status
 * @param brandDate - Brand date (created_at)
 * @returns
 * @example
 * const { data, isLoading, error } = useBrands(page, pageSize, keyword, status, brandDate);
 * @author ヤン
 */
export const useBrands = (
  page: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  status: string = "",
  brandDate: string = ""
) => {
  return useQuery({
    queryKey: ["brands", page, pageSize, keyword, status, brandDate],
    queryFn: () =>
      axios.get("/api/admin/brands", {
        params: { page, pageSize, keyword, status, brandDate },
      }),
    select: (data) => data.data,
  });
};

/**
 * Use brands by id
 * @param brandId - Brand id
 * @returns
 * @example
 * const { data, isLoading, error } = useBrandsById(brandId);
 * @author ヤン
 */
export const useBrandsById = (brandId: number) => {
  return useQuery({
    queryKey: ["brandsById", brandId],
    queryFn: () => axios.get(`/api/admin/brands/${brandId}`),
    select: (data) => data.data,
    enabled: !!brandId,
  });
};

/**
 * Use change brand status
 * @param brandId - Brand id
 * @param status - Brand status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeBrandStatus();
 * @author ヤン
 */
export const useChangeBrandStatus = () => {
  return useMutation({
    mutationFn: ({ brandId, status }: { brandId: number; status: boolean }) =>
      axios.patch(`/api/admin/brands/${brandId}/status`, { status }),
  });
};

/**
 * Use create brand
 * @param brand - Brand
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateBrand(brand);
 * @author ヤン
 */
export const useCreateBrand = () => {
  return useMutation({
    mutationFn: (brand: { name: string }) =>
      axios.post(`/api/admin/brands`, brand),
  });
};

/**
 * Use update brand
 * @param brand - Brand
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateBrand(brand);
 * @author ヤン
 */
export const useUpdateBrand = () => {
  return useMutation({
    mutationFn: (brand: { name: string; brand_id: number }) =>
      axios.put(`/api/admin/brands/${brand.brand_id}`, brand),
  });
};

/**
 * Use delete brand
 * @param brandId - Brand id
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteBrand(brandId);
 * @author ヤン
 */
export const useDeleteBrand = () => {
  return useMutation({
    mutationFn: (brandId: number) => axios.delete(`/api/admin/brands/${brandId}`),
  });
};
