"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { CartItem } from "@/types/cart";
import { useState, useEffect } from "react";
import { useUpdateClientSecret } from "@/hooks/user/useStripe";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("Stripe publishable key is missing");
}

const stripePromise = loadStripe(publishableKey!);

const Checkout = ({
  cart,
  billingAddressId,
  shippingAddressId,
}: {
  cart: CartItem;
  billingAddressId: number;
  shippingAddressId: number;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { mutateAsync: updateClientSecret } = useUpdateClientSecret();

  const getSecret = async () => {
    const secret = await updateClientSecret({
      cart,
      billingAddressId,
      shippingAddressId,
    });
    setClientSecret(secret);
  };

  useEffect(() => {
    getSecret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!clientSecret)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p>読み込み中...</p>
      </div>
    );
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: () => Promise.resolve(clientSecret) }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default Checkout;
