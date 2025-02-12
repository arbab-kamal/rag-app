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
      label: "Billing",
      icon: CreditCard,
      onClick: () => router.push("/billing"),
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
      label: "Support",
      icon: HelpCircle,
      onClick: () => router.push("/support"),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems.map((item, index) => (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
