import { useQuery } from "@tanstack/react-query";
import axios from "axios";  

/**
 * Use news
 * @returns
 * @author ヤン
 */
export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await axios.get("/api/news");
      return res.data;
    },
  });
};  

/**
 * Use news by id
 * @param newsId - News id
 * @returns
 * @author ヤン
 */
export const useNewsById = (newsId: number) => {
  return useQuery({
    queryKey: ["newsById", newsId],
    queryFn: async () => {
      const res = await axios.get(`/api/news/${newsId}`);
      return res.data;
    },
    enabled: !!newsId,
  });
};

/**
 * Use news list
 * @param page - Page number
 * @param pageSize - Page size
 * @param title - News title
 * @param status - News status
 * @param newsDate - News date (created_at)
 * @returns
 * @author ヤン
 */
export const useNewsList = (
  page: number = 1,
  pageSize: number = 10,
  title: string = "",
  newsDate: string = ""
) => {
  return useQuery({
    queryKey: ["news", page, pageSize, title, newsDate],
    queryFn: () =>
      axios.get("/api/news/list", {
        params: { page, pageSize, title, newsDate },
      }),
    select: (data) => data.data,
  });
};
 