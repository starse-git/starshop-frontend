import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";

/**
 * Add to cart
 * @param productId - Product id
 * @param quantity - Quantity
 * @returns
 * @author ヤン
 */
export const useAddToCart = () => {
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => {
      const res = await axios.post("/api/user/cart/add", {
        productId,
        quantity,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};

/**
 * Get cart items
 * @returns
 * @author ヤン
 */
export const useGetCartItems = () => {
  return useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const res = await axios.get("/api/user/cart/items", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};

/**
 * Update cart
 * @param cartId - Cart id
 * @param items - Cart items
 * @returns
 * @author ヤン
 */
export const useUpdateCart = () => {
  return useMutation({
    mutationFn: async ({
      cartId,
      items,
    }: {
      cartId: number;
      items: { productId: number; quantity: number }[];
    }) => {
      const res = await axios.patch("/api/user/cart/items", {
        cartId,
        items,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};

/**
 * Update cart item quantity
 * @param cartId - Cart id
 * @param productId - Product id
 * @param quantity - Quantity
 * @returns
 * @author ヤン
 */
export const useUpdateCartItemQuantity = () => {
  return useMutation({
    mutationFn: async ({
      cartItemId,
      productId,
      quantity,
    }: {
      cartItemId: number;
      productId: number;
      quantity: number;
    }) => {
      const res = await axios.patch("/api/user/cart/update-item", {
        cartItemId,
        productId,
        quantity,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};

/**
 * Delete cart item
 * @param cartId - Cart id
 * @param productId - Product id
 * @returns
 * @author ヤン
 */
export const useDeleteCartItem = () => {
  return useMutation({
    mutationFn: async ({
      cartItemId,
      productId,
    }: {
      cartItemId: number;
      productId: number;
    }) => {
      const res = await axios.delete("/api/user/cart/delete-item", {
        data: {
          cartItemId,
          productId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};

/**
 * Get cart count
 * @returns
 * @author ヤン
 */
export const useCartCount = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID once
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUserId(data.user?.id ?? null);
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use React Query to fetch count
  const { data: cartCount = 0 } = useQuery({
    queryKey: ["cart-count", userId],
    queryFn: async () => {
      const res = await axios.get("/api/user/cart/count", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    enabled: !!userId, // only run when userId is available
    staleTime: 0,
  });

  // Real-time subscription to revalidate query
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`cart-items-count-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["cart-count", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, queryClient]);

  return cartCount.data;
};

/**
 * Delete cart
 * @param cartId - Cart id
 * @returns
 * @author ヤン
 */
export const useDeleteCart = () => {
  return useMutation({
    mutationFn: async (cartId: number) => {
      const res = await axios.delete("/api/user/cart", {
        data: {
          cartId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};
