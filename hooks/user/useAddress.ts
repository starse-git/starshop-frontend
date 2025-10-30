import { useMutation, useQuery } from "@tanstack/react-query";
import { AddressForm } from "@/types/addresses";
import axios from "axios";

/**
 * 配送先住所を取得する
 * @returns
 * @author ヤン
 */
export const useGetShippingAddress = () => {
  return useQuery({
    queryKey: ["shipping-address"],
    queryFn: async () => {
      const res = await axios.get("/api/user/addresses/shipping");
      return res.data;
    },
  });
};

/**
 * 請求先住所を取得する
 * @returns
 * @author ヤン
 */
export const useGetBillingAddress = () => {
  return useQuery({
    queryKey: ["billing-address"],
    queryFn: async () => {
      const res = await axios.get("/api/user/addresses/billing");
      return res.data;
    },
  });
};

/**
 * 配送先住所を更新する
 * @returns
 * @author ヤン
 */
export const useUpdateShippingAddress = () => {
  return useMutation({
    mutationFn: async ({
      addressId,
      addressData,
    }: {
      addressId: number;
      addressData: AddressForm;
    }) => {
      const res = await axios.patch(
        "/api/user/addresses/shipping",
        {
          addressId,
          addressData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });
};

/**
 * 配送先住所を登録する
 * @returns
 * @author ヤン
 */
export const useCreateShippingAddress = () => {
  return useMutation({
    mutationFn: async ({
      addressData,
    }: {
      addressData: AddressForm;
    }) => {
      const res = await axios.post(
        "/api/user/addresses/shipping",
        {
          addressData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });
};

/**
 * 請求先住所を更新する
 * @returns
 * @author ヤン
 */
export const useUpdateBillingAddress = () => {
  return useMutation({
    mutationFn: async ({
      addressId,
      addressData,
    }: {
      addressId: number;
      addressData: AddressForm;
    }) => {
      const res = await axios.patch(
        "/api/user/addresses/billing",
        {
          addressId,
          addressData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });
};

/**
 * 請求先住所を登録する
 * @returns
 * @author ヤン
 */
export const useCreateBillingAddress = () => {
  return useMutation({
    mutationFn: async ({
      addressData,
    }: {
      addressData: AddressForm;
    }) => {
      const res = await axios.post(
        "/api/user/addresses/billing",
        {
          addressData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });
};

/**
 * 郵便番号を取得する
 * @returns
 * @author ヤン
 */
export const useAddressByPostcode = () => {
  return useMutation({
    mutationFn: async ({ postcode }: { postcode: string }) => {
      const res = await axios.post(
        "/api/user/addresses/postcode",
        {
          postcode: postcode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });
};
