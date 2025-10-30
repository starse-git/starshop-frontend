import { createClient } from "@/utils/supabase/client";

/**
 * Upload product image
 * @param file - File
 * @param productId - Product id
 * @returns 
 * @author ヤン
 */
export const uploadProductImage = async (file: File, productId: number) => {
  const supabase = createClient();

  const sanitizedFileName = file.name
    .replace(/\s+/g, "-") 
    .replace(/[^\w.-]/g, "") 
    .toLowerCase();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const filePath = `products/${productId}/${timestamp}-${sanitizedFileName}`;


  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, { upsert: true });

  if (error) {
    throw error;
  }

  await supabase.from("product_images").insert({
    product_id: productId,
    image_url: data.path,
  });

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return {
    success: true,
    message: "Image uploaded successfully",
    data: urlData.publicUrl,
  };
};

/**
 * Delete product image
 * @param imagePath - Image path
 * @returns 
 * @author ヤン
 */
export const deleteProductImage = async (imagePath: string) => {
  const supabase = createClient();

  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from("product-images")
    .remove([imagePath]);

  if (storageError) {
    throw storageError;
  }

  // Delete the DB record
  const { error: dbError } = await supabase
    .from("product_images")
    .delete()
    .eq("image_url", imagePath);

  if (dbError) {
    throw dbError;
  }

  return {
    success: true,
    message: "Image deleted successfully",
  };
};

/**
 * Delete image records
 * @param productId - Product id
 * @returns 
 * @author ヤン
 */
export const deleteImageRecords = async (productId: number, imageUrls: string[]) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .in("image_url", imageUrls);

  if (error) {
    throw error;
  }

  return {
    success: true,
    message: "Image records deleted successfully",
  };
};

/**
 * Save image order
 * @param productId - Product id
 * @returns 
 * @author ヤン
 */
export const saveImageOrder = async ({
  productId,
  images,
}: {
  productId: number;
  images: { image_url: string; image_order: number }[];
}) => {
  const supabase = createClient();

  const updates = images.map(({ image_url, image_order }) =>
    supabase
      .from("product_images")
      .update({ image_order })
      .eq("product_id", productId)
      .eq("image_url", image_url)
  );

  const results = await Promise.all(updates);

  for (const { error } of results) {
    if (error) {
      throw error;
    }
  }

  return {
    success: true,
    message: "Image order saved successfully",
  };
};



