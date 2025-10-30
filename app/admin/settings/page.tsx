"use client";

import { Button } from "@/components/ui/button";
import { createOrderMail } from "@/lib/api/user/createOrderMailService";
import { cancelOrderMail } from "@/lib/api/user/cancelOrderMailService";
import { sendShippingNotificationMail } from "@/lib/api/admin/sendShippingMailService";
import { toast } from "sonner";
import { useState } from "react";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState({
    orderMail: false,
    cancelOrderMail: false,
    shippingNotificationMail: false,
  });
  const handleToTestOrderMail = async () => {
    setIsLoading((prev) => ({ ...prev, orderMail: true }));
    const orderEmailBody = {
      orderId: 123456,
      username: "Yan",
      total: 1000,
      products: [
        {
          name: "Product 1",
          price: 500,
          quantity: 2,
          taxPrice: 500,
        },
        {
          name: "Product 2",
          price: 500,
          quantity: 1,
          taxPrice: 500,
        },
      ],
    };
    await createOrderMail(orderEmailBody).then((res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
    setIsLoading((prev) => ({ ...prev, orderMail: false }));
  };

  const handleToTestCancelOrderMail = async () => {
    setIsLoading((prev) => ({ ...prev, cancelOrderMail: true }));
    const cancelOrderEmailBody = {
      orderId: 123456,
      total: 1000,
      products: [
        {
          product_name: "Product 1",
          price: 500,
          quantity: 2,
          tax_price: 500,
          tax_amount: 500,
        },
        {
          product_name: "Product 2",
          price: 500,
          quantity: 1,
          tax_price: 500,
          tax_amount: 500,
        },
      ],
      eightPercentTotal: 100,
      tenPercentTotal: 200,
      cancelReason: "Test Cancel Order",
      cancelDate: "2025-07-14",
      username: "Test User",
      userEmail: "testuser@example.com",
    };
    await cancelOrderMail(cancelOrderEmailBody).then((res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
    setIsLoading((prev) => ({ ...prev, cancelOrderMail: false }));
  };

  const handleToTestShippingNotificationMail = async () => {
    setIsLoading((prev) => ({ ...prev, shippingNotificationMail: true }));
    const shippingNotificationEmailBody = {
      orderId: 123456,
      userName: "Yan",
      products: [
        {
          product_name: "Product 1",
          price: 500,
          quantity: 2,
          tax_amount: 500,
        },
        {
          product_name: "Product 2",
          price: 500,
          quantity: 1,
          tax_amount: 500,
        },
      ],
      trackingNumber: "1234567890",
      carrier: "Yamato",
      shippingDate: "2025-07-14",
      shippingAddress: "123 Main St, Anytown, USA",
      userEmail: "yannainghtwe.777.yy@gmail.com",
    };
    await sendShippingNotificationMail(shippingNotificationEmailBody).then((res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
    setIsLoading((prev) => ({ ...prev, shippingNotificationMail: false }));
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-12 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between mb-10">
          <div className="grid flex-1 gap-1 text-left">
            <h2>設定</h2>
          </div>
        </div>
        <div>
          <Button
            className="bg-primary/100 hover:bg-primary/60 text-white cursor-pointer"
            onClick={handleToTestOrderMail}
            disabled={isLoading.orderMail}
          >
            {isLoading.orderMail ? "送信中..." : "注文メール送信"}
          </Button>
        </div>
        <div>
          <Button
            className="bg-primary/100 hover:bg-primary/60 text-white cursor-pointer"
            onClick={handleToTestCancelOrderMail}
            disabled={isLoading.cancelOrderMail}
          >
            {isLoading.cancelOrderMail ? "送信中..." : "注文キャンセルメール送信"}
          </Button>
        </div>
        <div>
          <Button
            className="bg-primary/100 hover:bg-primary/60 text-white cursor-pointer"
            onClick={handleToTestShippingNotificationMail}
            disabled={isLoading.shippingNotificationMail}
          >
            {isLoading.shippingNotificationMail ? "送信中..." : "発送通知メール送信"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
