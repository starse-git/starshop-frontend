import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use faqs
 * @param page - Page number
 * @param pageSize - Page size
 * @param keyword - Faq keyword
 * @param status - Faq status
 * @param faqDate - Faq date (created_at)
 * @returns
 * @example
 * const { data, isLoading, error } = useFaqs(page, pageSize, keyword, status, faqDate);
 * @author ヤン
 */
export const useFaqs = (
  page: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  status: string = "",
  faqDate: string = ""
) => {
  return useQuery({
    queryKey: ["faqs", page, pageSize, keyword, status, faqDate],
    queryFn: () =>
      axios.get("/api/admin/faqs", {
        params: { page, pageSize, keyword, status, faqDate },
      }),
    select: (data) => data.data,
  });
};

/**
 * Use faqs by id
 * @param faqId - Faq id
 * @returns
 * @example
 * const { data, isLoading, error } = useFaqsById(faqId);
 * @author ヤン
 */
export const useFaqsById = (faqId: number) => {
  return useQuery({
    queryKey: ["faqsById", faqId],
    queryFn: () => axios.get(`/api/admin/faqs/${faqId}`),
    select: (data) => data.data,
    enabled: !!faqId,
  });
};

/**
 * Use change faq status
 * @param faqId - Faq id
 * @param status - Faq status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeFaqStatus(faqId, status);
 * @author ヤン
 */
export const useChangeFaqStatus = (faqId: number, status: boolean) => {
  return useMutation({
    mutationFn: () => axios.patch(`/api/admin/faqs/${faqId}/status`, { status }),
  });
};

/**
 * Use create faq
 * @param faq - Faq
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateFaq(faq);
 * @author ヤン
 */
export const useCreateFaq = () => {
  return useMutation({
    mutationFn: (faq: { question: string; answer: string }) =>
      axios.post(`/api/admin/faqs`, faq),
  });
};

/**
 * Use update faq
 * @param faq - Faq
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateFaq(faq);
 * @author ヤン
 */
export const useUpdateFaq = () => {
  return useMutation({
    mutationFn: (faq: { question: string; answer: string; faqs_id: number }) =>
      axios.put(`/api/admin/faqs/${faq.faqs_id}`, faq),
  });
};

/**
 * Use delete faq
 * @param faqId - Faq id
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteFaq(faqId);
 * @author ヤン
 */
export const useDeleteFaq = () => {
  return useMutation({
    mutationFn: (faqId: number) => axios.delete(`/api/admin/faqs/${faqId}`),
  });
};
