import { useMutation } from "@tanstack/react-query";
import { uploadProfileImage } from "@/lib/api/user/uploadFileService";

/**
 * Use upload profile image
 * @param args - Upload profile image args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUploadProfileImage(file);
 * @author ヤン
 */
export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      return await uploadProfileImage(file);
    },
  });
};
