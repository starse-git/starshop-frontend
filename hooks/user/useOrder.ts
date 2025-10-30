import { useMutation, useQuery } from "@tanstack/react-query";
import { Order, OrderItemCreate } from "@/types/orders";
import axios from "axios";

/**
 * Get order summaries
 * @param page - Page number (default: 1)
 * @param pageSize - Number of records per page (default: 10)
 * @param orderDate - Order date
 * @param status - Order status
 * @returns Paginated order summaries and total count
 * @author ヤン
 */
export const useGetOrderSummaries = (
  page: number = 1,
  pageSize: number = 10,
  orderDate: string = "",
  status: string = "all"
) => {
  return useQuery({
    queryKey: ["order-summaries", page, pageSize, orderDate, status],
    queryFn: () =>
      axios.get("/api/user/orders/summary", {
        params: { page, pageSize, orderDate, status },
      }),
    select: (response) => response.data,
  });
};

/**
 * Create order
 * @param order - Order object
 * @returns Created order
 * @author ヤン
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({ order, userId }: { order: Order; userId: string }) =>
      axios.post("/api/user/orders", { order, userId }),
  });
};

/**
 * Create order item
 * @param orderItem - Order item object
 * @returns Created order item
 * @author ヤン
 */
export const useCreateOrderItem = () => {
  return useMutation({
    mutationFn: (orderItem: OrderItemCreate[]) =>
      axios.post("/api/user/orders/item", orderItem),
  });
};

/**
 * Get customer order details by id
 * @param orderId - Order id
 * @returns Customer order details
 * @author ヤン
 */
export const useGetOrderSummaryDetailsByOrderId = (orderId: number) => {
  return useQuery({
    queryKey: ["order-summary-details", orderId],
    queryFn: () => axios.get("/api/user/orders/" + orderId + "/details"),
    enabled: !!orderId,
    select: (response) => response.data,
  });
};

interface UpdateOrderStatusParams {
  orderId: number;
  status: string;
  notes: string;
}

/**
 * Update order status
 * @param params - Update order status params
 * @returns Updated order details
 * @author ヤン
 */
export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: (params: UpdateOrderStatusParams) =>
      axios.patch("/api/user/orders/" + params.orderId + "/status", {
        status: params.status,
        notes: params.notes,
      }),
  });
};
