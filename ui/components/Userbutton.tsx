"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  User,
  Settings,
  HelpCircle,
  Bot,
  LogOut,
} from "lucide-react";

export function UserProfileButton() {
  const router = useRouter();

  const menuItems = [
    {
      label: "Profile",
      icon: User,
      onClick: () => router.push("/profile"),
    },
    {
      label: "Documents",
      icon: CreditCard,
      onClick: () => router.push("/documents"),
    },
    {
      label: "AI Agents",
      icon: Bot,
      onClick: () => router.push("/ai-agents"),
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => router.push("/settings"),
    },
    {
      label: "About",
      icon: HelpCircle,
      onClick: () => router.push("/about"),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.png" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className="cursor-pointer flex items-center gap-2"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/logout")}
          className="cursor-pointer flex items-center gap-2 text-red-500"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
