/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import {
  MessageCircle,
  Image,
  Code,
  Sparkles,
  Lightbulb,
  ArrowUp,
  ChevronRight,
  Bot,
} from "lucide-react";
import { useTheme, getThemeClasses } from "./Theme";
import Typewriter from "./Typewriter";
import Navbar from "./navbar";
import { Input } from "./ui/input";

interface Message {
  id: number;
  content: string;
  type: "user" | "ai";
}

interface Option {
  icon: React.ReactNode;
  text: string;
  description: string;
}

const ChatInterface = () => {
  const [showMore, setShowMore] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isChattingStarted, setIsChattingStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const { data: session, status } = useSession();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
    }
  };

  const mainOptions: Option[] = [
    {
      icon: <Image className="w-4 h-4" />,
      text: "Risk Analyzed",
      description: "Generate visual content",
    },
    {
      icon: <Code className="w-4 h-4" />,
      text: "Code",
      description: "Write or review code",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      text: "Surprise me",
      description: "Get a creative response",
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Make a plan",
      description: "Create structured plans",
    },
  ];

  const moreOptions: Option[] = [
    {
      icon: <MessageCircle className="w-4 h-4" />,
      text: "Explain About Document",
      description: "Create engaging narratives",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      text: "Analyze data",
      description: "Process and interpret data",
    },
  ];

  const fetchAIResponse = async (query: string) => {
    setIsLoading(true);
    try {
      // Convert the query to URL-safe format
      const encodedQuery = encodeURIComponent(query);
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
      }/rag?query=${encodedQuery}`;

      console.log("Sending request to:", url); // Debug log

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.text(); // Change to text() since backend returns plain string
      console.log("Response data:", data); // Debug log

      return data;
    } catch (error) {
      console.error("Error fetching RAG response:", error);
      return "Sorry, I couldn't process your request. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now(),
      content: messageText,
      type: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsChattingStarted(true);
    setMessageText("");

    const aiResponseText = await fetchAIResponse(messageText);

    const newAIMessage: Message = {
      id: Date.now() + 1,
      content: aiResponseText,
      type: "ai",
    };

    setMessages((prevMessages) => [...prevMessages, newAIMessage]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleOptionClick = (optionText: string) => {
    setMessageText(optionText);
    handleSendMessage();
  };

  return (
    <div
      className={`container mx-auto px-4 min-h-screen ${themeClasses.background}`}
    >
      {/* Rest of the JSX remains exactly the same */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <main
        className={`flex flex-col items-center justify-center min-h-screen mb-4 ${themeClasses.background}`}
      >
        <div className="w-full max-w-2xl mt-24 flex flex-col h-[calc(100vh-100px)]">
          {/* {session && !isChattingStarted && (
            <h1 className={`text-3xl text-center mb-8 ${themeClasses.text}`}>
              {`Welcome, ${session.user.name || session.user.email}!`}
            </h1>
          )} */}

          <div className="flex-grow overflow-auto mb-4">
            {isChattingStarted && (
              <div className="h-full scroll-container">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`mb-2 p-3 flex items-start ${
                      msg.type === "user"
                        ? "justify-end"
                        : "justify-start w-full"
                    }`}
                  >
                    {msg.type === "ai" && (
                      <div className="mr-2 mt-2">
                        <Bot
                          className={`w-6 h-6 ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    )}
                    <span
                      className={`inline-block rounded-lg px-3 py-2 break-words ${
                        msg.type === "user"
                          ? "max-w-[70%] bg-[var(--user-message-bg)] text-[var(--user-message-text)]"
                          : "w-full bg-[var(--ai-message-bg)] text-[var(--ai-message-text)]"
                      }`}
                    >
                      {msg.type === "ai" && index === messages.length - 1 ? (
                        <Typewriter text={msg.content} speed={20} />
                      ) : (
                        msg.content
                      )}
                    </span>
                    {msg.type === "user" && (
                      <div className="ml-2 mt-2">{/* @ts-ignore */}</div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="w-full max-w-2xl mx-auto mb-4">
            <div
              className={`rounded-lg p-3 flex items-center ${
                theme === "light"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              <input
                type="text"
                placeholder={
                  isChattingStarted
                    ? "Type your message..."
                    : "What can I help you with?"
                }
                className="bg-transparent flex-1 outline-none w-full text-lg px-4"
                value={messageText}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUploadClick}
                  aria-label="Upload file"
                  className="text-gray-400 hover:text-white"
                >
                  <AiOutlinePaperClip size={24} />
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText || isLoading}
                  className={`rounded-full p-1 ${
                    messageText
                      ? theme === "light"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                      : `bg-[var(--button-bg)] text-[var(--button-text)]`
                  }`}
                >
                  <ArrowUp
                    className={`w-4 h-4 ${
                      messageText
                        ? theme === "light"
                          ? "text-white"
                          : "text-black"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {(!isChattingStarted || messages.length < 4) && (
            <div className="w-full max-w-2xl mx-auto mt-4">
              <div className="grid grid-cols-2 gap-2 px-4">
                {mainOptions.map((option) => (
                  <button
                    key={option.text}
                    onClick={() => handleOptionClick(option.text)}
                    className={`flex items-center p-3 rounded-lg text-left ${
                      theme === "light"
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <div className="mr-4">{option.icon}</div>
                    <div>
                      <p className="font-semibold">{option.text}</p>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {showMore && (
                <div className="grid grid-cols-2 gap-2 px-4 mt-4">
                  {moreOptions.map((option) => (
                    <button
                      key={option.text}
                      onClick={() => handleOptionClick(option.text)}
                      className={`flex items-center p-3 rounded-lg text-left ${
                        theme === "light"
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <div className="mr-4">{option.icon}</div>
                      <div>
                        <p className="font-semibold">{option.text}</p>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowMore(!showMore)}
                className={`flex items-center p-3 rounded-lg mt-3 ml-4 text-left ${
                  theme === "light"
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {showMore ? "Show Less Options" : "Show More Options"}
                <ChevronRight
                  className={`w-4 h-4 inline ${
                    showMore ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
