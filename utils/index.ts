import { createClient } from "@/utils/supabase/client";
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key";

/**
 * Convert price to yen
 * @param price - Price
 * @returns Yen (ja-JP)
 * @author ヤン
 */
export const convertToYen = (price: number) => {
  const yen = "¥";
  return yen + Math.floor(price).toLocaleString("ja-JP");
};

/**
 * Convert date to locale date time
 * @param date - Date
 * @returns Locale date time (ja-JP)
 * @author ヤン
 */
export const convertToLocaleDateTime = (date: string, city: string, format: string = "YYYY/MM/DD") => {
  const convertedTime = dayjs.utc(date).tz(city).format(format);
  return convertedTime;
};

/**
 * Get public URL
 * @param path - Path
 * @returns Public URL
 * @author ヤン
 */
export const getPublicUrl = (path: string) => {
  const supabase = createClient();
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);

  if (!data) {
    return "";
  }

  return data.publicUrl;
};

/**
 * Get profile image
 * @param path - Path
 * @returns Profile image URL
 * @author ヤン
 */
export const getProfileImage = (path: string) => {
  const supabase = createClient();
  const { data } = supabase.storage.from("profile-images").getPublicUrl(path);

  if (!data) {
    return "";
  }

  return data.publicUrl;
};

/**
 * Calculate price with tax
 * @param price - Price
 * @param tax - Tax
 * @returns Price with tax
 * @author ヤン
 */
export const priceWithTax = (price: number, tax: number | null) => {
  if (!tax) {
    return price;
  }
  return Math.floor(price + (price * tax) / 100);
};

/**
 * Encrypt a string using AES encryption.
 * @param str - The plain string to encrypt
 * @returns Encrypted string (Base64)
 * @author ヤン
 */
export const encryptString = (data: string) => {
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY
  ).toString();
  return btoa(cipherText)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Make URL-safe
};

/**
 * Decrypt an AES-encrypted string.
 * @param encrypted - The encrypted string (Base64)
 * @returns Decrypted plain text string
 * @author ヤン
 */
export const decryptString = (cipherText: string) => {
  try {
    const base64CipherText = cipherText.replace(/-/g, "+").replace(/_/g, "/"); // Convert back to original Base64
    const bytes = CryptoJS.AES.decrypt(atob(base64CipherText), ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    if (error) {
      return null;
    }
  }
};

/**
 * Trim string to a specified length and end with "..."
 * @param str - String
 * @param length - Length
 * @returns Trimmed string
 * @author ヤン
 */
export const trimString = (str: string, length: number) => {
  if (str.length <= length) {
    return str;
  }
  return str.trim().slice(0, length) + "...";
};
