import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use get customer order details by id
 * @param orderId - Order id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetOrderSummaryDetailsByOrderId(orderId);
 * @author ヤン
 */
export const useGetOrderSummaryDetailsByOrderId = (orderId: number) => {
  return useQuery({
    queryKey: ["customer-order-details", orderId],
    queryFn: () => axios.get(`/api/admin/orders/summary-details/${orderId}`),
    enabled: !!orderId,
    select: (response) => response.data,
  });
};

type UpdateTrackingPayload = {
  orderId: number;
  trackingNumber: string;
  shippingCompany: string;
  shippingDate: string;
  status: string;
};

/**
 * Use update shipping tracking number
 * @param orderId - Order id
 * @param trackingNumber - Tracking number
 * @param shippingCompany - Shipping company
 * @param shippingDate - Shipping date
 * @param status - Order status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateShippingTrackingNumber(orderId, trackingNumber, shippingCompany);
 * @author ヤン
 */
export const useUpdateShippingTrackingNumber = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      trackingNumber,
      shippingCompany,
      shippingDate,
      status,
    }: UpdateTrackingPayload) => axios.post(`/api/admin/orders/update-tracking`, {
      orderId,
      trackingNumber,
      shippingCompany,
      shippingDate,
      status,
    }),
  });
};

/**
 * Use get order summaries
 * @param page - Page number (default: 1)
 * @param pageSize - Number of records per page (default: 10)
 * @param orderDate - Order date
 * @param customerName - Customer name
 * @param status - Order status
 * @returns Paginated order summaries and total count
 * @author ヤン
 */
export const useGetOrderSummaries = (
  page: number = 1,
  pageSize: number = 10,
  orderDate: string = "",
  customerName: string = "",
  status: string = "all"
) => {
  return useQuery({
    queryKey: [
      "order-summaries",
      page,
      pageSize,
      orderDate,
      customerName,
      status,
    ],
    queryFn: () =>
      axios.get(`/api/admin/orders/summaries`, {
        params: {
          page,
          pageSize,
          orderDate,
          customerName,
          status,
        },
      }),
    select: (response) => response.data,
  });
};

/**
 * Use update order status
 * @param orderId - Order id
 * @param status - Order status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateOrderStatus(orderId, status);
 * @author ヤン
 */
export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      notes,
    }: {
      orderId: number;
      status: string;
      notes?: string;
    }) => axios.post(`/api/admin/orders/update-status`, {
      orderId,
      status,
      notes,
    }),
  });
};
