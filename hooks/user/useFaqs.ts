import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use faqs
 * @returns
 * @author ヤン
 */
export const useFaqs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axios.get("/api/faqs");
      return res.data;
    },
  });
};

/**
 * Use faqs by id
 * @param faqId - Faq id
 * @returns
 * @author ヤン
 */
export const useFaqsById = (faqId: number) => {
  return useQuery({
    queryKey: ["faqsById", faqId],
    queryFn: async () => {
      const res = await axios.get(`/api/faqs/${faqId}`);
      return res.data;
    },
  });
};
