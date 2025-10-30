import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileDropDown = () => {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white text-black border border-black/10 rounded-full w-10 h-10 hover:bg-black/10 active:bg-black/10 focus:outline-none focus:ring-0 cursor-pointer">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border border-black/10 cursor-pointer" align="end">
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:bg-white-bg active:text-white focus:outline-none focus:ring-0 cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
