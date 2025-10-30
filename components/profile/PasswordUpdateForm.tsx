"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useUpdatePassword } from "@/hooks/user/useProfile";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(2, "新しいパスワードは2文字以上で入力してください"),
    confirmPassword: z
      .string()
      .min(2, "新しいパスワード(確認)は2文字以上で入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "新しいパスワードと新しいパスワード(確認)が一致しません",
    path: ["confirmPassword"],
  });

const PasswordUpdateForm = () => {
  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updatePassword(data.password, {
      onSuccess: () => {
        toast.success("パスワードを更新しました");
      },
      onError: (err) => {
        toast.error(err?.message);
      },
    });
  };
  return (
    <div className="space-y-6 py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 md:w-[400px] w-full"
        >
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={""}
            hidden
            readOnly
          />
          <FormInputComponent
            id="password"
            control={form.control}
            name="password"
            type="password"
            label="新しいパスワード"
            className="h-11 placeholder:text-sm bg-white/50"
            autoComplete="new-password"
          />
          <FormInputComponent
            id="confirmPassword"
            control={form.control}
            name="confirmPassword"
            label="新しいパスワード(確認)"
            type="password"
            className="h-11 placeholder:text-sm bg-white/50"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
          >
            {isUpdatingPassword ? "更新中..." : "更新"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordUpdateForm;
