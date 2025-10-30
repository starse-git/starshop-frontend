import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProfileImage from "@/public/profile/profileDummy.jpg";

const ProfileImageDialog = ({
  open,
  setOpen,
  profileImage,
  setProfileImage,
  previewUrl,
  setPreviewUrl,
  uploadProfileImage,
  isPending,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  profileImage: string;
  setProfileImage: (profileImage: string) => void;
  previewUrl: string | null;
  setPreviewUrl: (previewUrl: string | null) => void;
  uploadProfileImage: (file: File) => void;
  isPending: boolean;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      uploadProfileImage(selectedFile);
      setProfileImage(URL.createObjectURL(selectedFile));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
        <DialogHeader>
          <DialogTitle>プロフィール画像</DialogTitle>
        </DialogHeader>

        <DialogDescription className="flex flex-col items-center space-y-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer border-2 border-white-bg rounded-full relative"
          >
            <Image
              src={previewUrl || profileImage || ProfileImage}
              alt="Profile"
              width={120}
              height={120}
              className="w-40 h-40 object-cover rounded-full"
            />
            <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 p-1.5 bg-black/50 rounded-full cursor-pointer text-white">
              クリップ
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="space-x-2 flex justify-end w-full">
            <Button
              onClick={handleConfirm}
              disabled={!selectedFile || isPending}
              className="w-[100px] text-white-bg cursor-pointer"
            >
              {isPending ? "保存中..." : "OK"}
            </Button>
          </span>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageDialog;
