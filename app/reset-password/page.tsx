"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import AuthTitle from "@/components/auth/AuthTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { useResetPassword } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { MESSAGES } from "@/types/messages";

// Form schema validation
const FormSchema = z.object({
  email: z.string().email("メールアドレスは正しく入力してください"),
});

const ResetPasswordPage = () => {
  const { mutate: resetPasswordMutate, isPending: isResetPasswordPending } = useResetPassword(); // Reset password mutation

  // Form instance
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    resetPasswordMutate(
      { email: data.email },
      {
        onSuccess: (res) => {
          toast.success(res.message);
        },
        onError: (err: Error) => {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };
  
  return (
    <Suspense fallback={<div>読み込み中。。。</div>}>
      <AuthLayout>
        <div className="px-4">
          <AuthTitle title="Reset Password" />

          <div className="my-8 w-full">
            <p className="text-sm">パスワードをリセットするために、メールアドレスを入力してください！</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full md:w-[400px]"
            >
              <FormInputComponent
                control={form.control}
                name="email"
                label="メールアドレス"
                placeholder="test@example.com"
                className="h-11 placeholder:text-sm"
              />
              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isResetPasswordPending}
              >
                {isResetPasswordPending ? "送信中..." : "Reset"}
              </Button>
            </form>
          </Form>
        </div>
      </AuthLayout>
    </Suspense>
  );
};

export default ResetPasswordPage;
