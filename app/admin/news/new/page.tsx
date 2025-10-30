"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import TiptapEditor from "@/components/app/TipTapEditor";
import { Form } from "@/components/ui/form";
import { useCreateNews } from "@/hooks/admin/useNews";
import { toast } from "sonner";
import { useEffect } from "react";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import AdminDatePicker from "@/components/admin/AdminDatePicker";

// Form schema validation
const FormSchema = z.object({
  title: z.string().min(1, "ニュース名は必須です"),
  content: z.string().min(1, "内容は必須です"),
  date: z.string().min(1, "日付は必須です"),
});

const NewsPage = () => {
  const router = useRouter(); // Get the router

  // Create news mutation
  const {
    mutate: createNews,
    error: createNewsError,
    isSuccess: createNewsSuccess,
    isPending: isCreatingNews,
  } = useCreateNews();

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      date: "",
    },
  });

  // Form submit handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createNews(data, {
      onSuccess: () => {
        toast.success("ニュースを登録しました");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // Create news success handler
  useEffect(() => {
    if (createNewsSuccess) {
      toast.success("ニュースを登録しました");
      router.back();
    }

    if (createNewsError) {
      toast.error(createNewsError.message);
    }
  }, [createNewsSuccess, createNewsError, router]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-[0px] rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border"
      >
        {/* Header */}
        <div className="flex justify-between mb-5">
          <div className="flex gap-2 text-left items-center">
            <ArrowLeft size={20} onClick={() => router.back()} />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              type="submit"
              className="bg-primary/100 hover:bg-primary/60 text-white cursor-pointer"
            >
              登録
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <FormInputComponent
            control={form.control}
            name="title"
            label="ニュース名"
            placeholder="ニュース名"
            className="placeholder:text-sm bg-white border border-black/10 rounded-md p-2 text-xs"
          />
          <div className="flex flex-col">
            <p className="text-sm mb-1.5">ニュース日付</p>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <AdminDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  styleName="w-full border border-white-bg rounded-md p-2"
                />
              )}
            />
            {form.formState.errors.date && (
              <p className="text-xs text-[#FF0000] mt-3">
                {form.formState.errors.date?.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-sm mb-1.5">ニュース内容</p>
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <TiptapEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {form.formState.errors.content && (
              <p className="text-xs text-[#FF0000] mt-3">
                {form.formState.errors.content?.message}
              </p>
            )}
          </div>
        </div>
      </form>

      <ServerActionLoadingComponent
        loading={isCreatingNews}
        message="ニュースを登録しています"
      />
    </Form>
  );
};

export default NewsPage;
