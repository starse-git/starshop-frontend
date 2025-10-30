import {
  deleteProductImage,
  uploadProductImage,
  deleteImageRecords,
  saveImageOrder,
} from "@/lib/api/admin/uploadFileService";
import { useMutation } from "@tanstack/react-query";

/**
 * Use upload files
 * @param args - Upload files args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUploadFiles({ files, productId });
 * @author ヤン
 */
export const useUploadFiles = () => {
  return useMutation({
    mutationFn: async ({
      files,
      productId,
    }: {
      files: File[];
      productId: number;
    }) => {
      await Promise.all(
        files.map((file) => uploadProductImage(file, productId))
      );
    },
  });
};

/**
 * Use delete files
 * @param args - Delete files args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteFiles({ files });
 * @author ヤン
 */
export const useDeleteFiles = () => {
  return useMutation({
    mutationFn: async ({ files }: { files: string[] }) => {
      await Promise.all(files.map((file) => deleteProductImage(file)));
    },
  });
};

/**
 * Use delete image records
 * @param args - Delete image records args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteImageRecords({ productId, imageUrls });
 * @author ヤン
 */
export const useDeleteImageRecords = () => {
  return useMutation({
    mutationFn: async ({ productId, imageUrls }: { productId: number, imageUrls: string[] }) => {
      await deleteImageRecords(productId, imageUrls);
    },
  });
};

/**
 * Use save image order
 * @param args - Save image order args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useSaveImageOrder({ productId, images });
 * @author ヤン
 */
export const useSaveImageOrder = () => {
  return useMutation({
    mutationFn: async ({ productId, images }: { productId: number, images: { image_url: string; image_order: number }[] }) => {
      await saveImageOrder({ productId, images });
    },
  });
};


  

