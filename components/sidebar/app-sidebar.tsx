import { Bell, Box, Home, Inbox, Bookmark, Settings, User, Blocks, ClipboardCheck } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/icons/logo.png";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "ダッシュボード",
    id: "dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "注文管理",
    id: "orders",
    url: "/admin/orders",
    icon: Inbox,
  },
  {
    title: "商品管理",
    id: "products",
    url: "/admin/products",
    icon: Box,
  },
  {
    title: "定期購入管理",
    id: "subscriptions",
    url: "/admin/subscriptions",
    icon: ClipboardCheck,
  },
  {
    title: "顧客管理",
    id: "customers",
    url: "/admin/customers",
    icon: User,
  },
  {
    title: "ニュース",
    id: "news",
    url: "/admin/news",
    icon: Bell,
  },
  {
    title: "FAQ",
    id: "faqs",
    url: "/admin/faqs",
    icon: Bookmark,
  },
  {
    title: "ブランド管理",
    id: "brands",
    url: "/admin/brands",
    icon: Blocks,
  },
  {
    title: "設定",
    id: "settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar>
      {/* Sticky Sidebar Header */}
      <SidebarHeader className="top-0 z-10 flex items-center justify-between px-4 py-3">
        <div className="relative w-[120px] h-[120px] flex items-center gap-5 p-5">
          <Image
            src={Logo.src}
            alt="Logo"
            width={160}
            height={160}
            priority={true}
            style={{ objectFit: "contain", width: "auto", height: "auto" }}
          />
        </div>
      </SidebarHeader>
      <div className="border-b mx-4 mb-5 border-black/10"></div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.id} className="mb-3">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "px-3 py-5",
                      pathname.includes(item.url)
                        ? "bg-black rounded-[7px] text-white hover:bg-black/80 hover:text-white"
                        : ""
                    )}
                  >
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
