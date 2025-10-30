import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use category
 * @returns 
 * @example
 * const { data, isLoading, error } = useCategory();
 * @author ヤン
 */
export const useCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => axios.get("/api/categories"),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
};
