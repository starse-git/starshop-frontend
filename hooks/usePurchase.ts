import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use purchase types
 * @returns
 * @author ヤン
 */
export const usePurchaseTypes = () => {
    return useQuery({
      queryKey: ["purchase-types"],
      queryFn: async () => {
        const res = await axios.get("/api/purchase/types");
        return res.data;
      },
    });
  };