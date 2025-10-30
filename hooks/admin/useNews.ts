import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use news
 * @param page - Page number
 * @param pageSize - Page size
 * @param title - News title
 * @param status - News status
 * @returns
 * @example
 * const { data, isLoading, error } = useNews(page, pageSize, title, status);
 * @author ヤン
 */
export const useNews = (
  page: number = 1,
  pageSize: number = 10,
  title: string = "",
  status: string = "",
  newsDate: string = ""
) => {
  return useQuery({
    queryKey: ["news", page, pageSize, title, status, newsDate],
    queryFn: () =>
      axios.get("/api/admin/news", {
        params: { page, pageSize, title, status, newsDate },
      }),
    select: (data) => data.data,
  });
};

/**
 * Use news by id
 * @param newsId - News id
 * @returns
 * @example
 * const { data, isLoading, error } = useNewsById(newsId);
 * @author ヤン
 */
export const useNewsById = (newsId: number) => {
  return useQuery({
    queryKey: ["newsById", newsId],
    queryFn: () => axios.get(`/api/admin/news/${newsId}`),
    select: (data) => data.data,
    enabled: !!newsId,
  });
};

/**
 * Use change news status
 * @param newsId - News id
 * @param status - News status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeNewsStatus(newsId, status);
 * @author ヤン
 */
export const useChangeNewsStatus = (newsId: number, status: boolean) => {
  return useMutation({
    mutationFn: () =>
      axios.patch(`/api/admin/news/${newsId}/status`, { status }),
  });
};

/**
 * Use create news
 * @param news - News
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateNews(news);
 * @author ヤン
 */
export const useCreateNews = () => {
  return useMutation({
    mutationFn: (news: { title: string; content: string; date: string }) =>
      axios.post("/api/admin/news", news),
  });
};

/**
 * Use update news
 * @param news - News
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateNews(news);
 * @author ヤン
 */
export const useUpdateNews = () => {
  return useMutation({
    mutationFn: (news: { title: string; content: string; news_id: number; date: string }) =>
      axios.patch(`/api/admin/news/${news.news_id}`, news),
  });
};

/**
 * Use delete news
 * @param newsId - News id
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteNews(newsId);
 * @author ヤン
 */
export const useDeleteNews = () => {
  return useMutation({
    mutationFn: (newsId: number) => axios.delete(`/api/admin/news/${newsId}`),
  });
};
