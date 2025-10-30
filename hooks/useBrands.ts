import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use brands
 * @returns
 * @author ヤン
 */
export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await axios.get("/api/brands");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};