"use client";

import BannerComponent from "@/components/app/BannerComponent";
import BannerImage from "@/public/products/Banner.png";
import { Form } from "@/components/ui/form";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactUs } from "@/lib/api/user/contactUsService";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";
import { MESSAGES } from "@/types/messages";

const FormSchema = z.object({
  email: z.string().email("メールアドレスは正しく入力してください"),
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  phone: z.string().min(2, "電話番号は2文字以上で入力してください"),
  subject: z.string().min(2, "件名は2文字以上で入力してください"),
  message: z.string().min(2, "メッセージは2文字以上で入力してください"),
});

const ContactUsPage = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const res = await contactUs(data);
      if (res?.success) {
        toast.success(res.message);
        form.reset();
      } else {
        toast.error(res?.message || "送信に失敗しました");
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <BannerComponent image={BannerImage} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 space-y-10 flex flex-col items-center justify-center text-center tracking-wider">
        <h1>お問い合わせ</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 md:w-[600px] w-full"
          >
            <FormInputComponent
              id="name"
              control={form.control}
              name="name"
              label="名前 (必須)"
              type="text"
              placeholder=""
              className="h-11 bg-white/40 placeholder:text-sm"
            />
            <FormInputComponent
              id="phone"
              control={form.control}
              name="phone"
              label="電話番号 (必須)"
              type="text"
              placeholder=""
              className="h-11 bg-white/40 placeholder:text-sm"
            />
            <FormInputComponent
              id="email"
              control={form.control}
              name="email"
              label="メールアドレス (必須)"
              placeholder=""
              className="h-11 bg-white/40 placeholder:text-sm"
            />
            <FormInputComponent
              id="subject"
              control={form.control}
              name="subject"
              label="件名 (必須)"
              placeholder=""
              className="h-11 bg-white/40 placeholder:text-sm"
            />
            <FormInputComponent
              type="textarea"
              id="message"
              control={form.control}
              name="message"
              label="メッセージ (必須)"
              placeholder=""
              className="h-50 bg-white/40 placeholder:text-sm border border-white-bg"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
            >
              {loading ? "送信中..." : "送信"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactUsPage;
