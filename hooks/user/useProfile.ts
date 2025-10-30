import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use profile
 * @returns
 * @author ヤン
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get("/api/user/profile");
      return res.data;
    },
    select: (data) => data,
  });
};

/**
 * Use update password
 * @returns
 * @author ヤン
 */
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const res = await axios.patch("/api/user/password", {
        newPassword,
      });
      return res.data;
    },
  });
};

/**
 * Use update profile
 * @returns
 * @author ヤン
 */
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (profile: {
      name: string;
    }) => {
      const res = await axios.patch("/api/user/profile", profile);
      return res.data;
    },
  });
};
