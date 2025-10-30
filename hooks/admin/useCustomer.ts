import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use customers
 * @param page - Page number
 * @param pageSize - Page size
 * @param searchQuery - Search query for name or email
 * @param status - Customer status
 * @returns
 * @example
 * const { data, isLoading, error } = useCustomers(page, pageSize, searchQuery, status);
 * @author ヤン
 */
export const useCustomers = (
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = "",
  status: string = ""
) => {
  return useQuery({
    queryKey: ["customers", page, pageSize, searchQuery, status],
    queryFn: () =>
      axios.get("/api/admin/customers/list", {
        params: { page, pageSize, searchQuery, status },
      }),
    select: (response) => response.data,
  });
};

/**
 * Use change customer status
 * @param customerId - Customer id
 * @param status - Customer status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeCustomerStatus(customerId, status);
 * @author ヤン
 */
export const useChangeCustomerStatus = (
  customerId: string | number,
  status: boolean
) => {
  return useMutation({
    mutationFn: () =>
      axios.post("/api/admin/customers/status", {
        customerId,
        status,
      }),
  });
};

/**
 * Use get customer by id
 * @param customerId - Customer id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetCustomerById(customerId);
 * @author ヤン
 */
export const useGetCustomerById = (customerId: string | number) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => axios.get("/api/admin/customers/" + customerId),
    select: (response) => response.data,
    enabled: !!customerId,
  });
};

/**
 * Use get customer address by id
 * @param customerId - Customer id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetCustomerAddressById(customerId);
 * @author ヤン
 */
export const useGetCustomerAddressById = (customerId: string | number) => {
  return useQuery({
    queryKey: ["customer-address", customerId],
    queryFn: () =>
      axios.get("/api/admin/customers/" + customerId + "/addresses"),
    select: (response) => response.data,
    enabled: !!customerId,
  });
};

/**
 * Use get customer orders by id
 * @param customerId - Customer id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetOrderSummaryByCustomerId(customerId);
 * @author ヤン
 */
export const useGetOrderSummaryByCustomerId = (
  customerId: string | number,
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: () =>
      axios.get("/api/admin/customers/" + customerId + "/orders", {
        params: { page, pageSize },
      }),
    select: (response) => response.data,
    enabled: !!customerId,
  });
};
