/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import ChatInterface from "@/components/ChatInterface";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { useTheme } from "@/components/Theme";
import React from "react";

type Props = {
  children: string;
};

const ChatLayout = ({ children }: Props) => {
  const { theme } = useTheme();
  return (
    //@ts-ignore
    <main className={`${theme.background} flex justify-between`}>
      <LeftSidebar />
      <ChatInterface />
      <RightSidebar />
      {children}
    </main>
  );
};

export default ChatLayout;
