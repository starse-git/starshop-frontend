import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use chart data
 * @returns Chart data
 * @author ヤン
 */
export const useChartData = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  return useQuery({
    queryKey: ["chart-data", fromDate, toDate],
    queryFn: () => axios.post("/api/admin/dashboard/chart", { fromDate, toDate }),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Use dashboard summary
 * @returns Dashboard summary
 * @author ヤン
 */
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => axios.get("/api/admin/dashboard/summary"),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Use top products
 * @returns Top products
 * @author ヤン
 */
export const useTopProducts = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  return useQuery({
    queryKey: ["top-products", fromDate, toDate],
    queryFn: () => axios.post("/api/admin/dashboard/top-products", {
      fromDate,
      toDate,
    }),
    select: (response) => response.data
  });
};

