"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import { BotMessageSquare } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { UserAvatar } from "@/components/user-avatar";

export default function ChatBox({ user }: { user: User }) {
  const [messages, setMessages] = useState<
    { sender: "ai" | "user"; text: string }[]
  >([{ sender: "ai", text: "👋 Hello! I’m your AI assistant." }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "This is a sample AI response." },
      ]);
      setIsTyping(false);
    }, 1200);
  };
  return (
    <>
      <SidebarContent className="px-2 py-5 space-y-2 text-sm">
        {messages.map((message, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "space-x-2",
              message.sender === "ai" ? "self-start" : "flex justify-end",
            )}
          >
            {message.sender === "ai" && (
              <span className="rounded-xl bg-foreground/20 dark:bg-foreground/10 p-2 align-top">
                🤖
              </span>
            )}
            <span className="px-3 py-2 rounded-xl max-w-[70%] dark:shadow-md bg-foreground/20 dark:bg-foreground/10 text-foreground">
              {message.text}
            </span>
            {message.sender === "user" && (
              <UserAvatar
                image={user.image as string}
                name="user profile"
                className="rounded-xl bg-foreground/20 dark:bg-foreground/10"
              />
            )}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl max-w-[30%] bg-foreground/20 dark:bg-foreground/10 self-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <span className="size-1.5 rounded-full bg-foreground animate-pulse" />
            <span className="size-1.5 rounded-full bg-foreground animate-pulse delay-200" />
            <span className="size-1.5 rounded-full bg-foreground animate-pulse delay-400" />
          </motion.div>
        )}
      </SidebarContent>
      <SidebarFooter className="mb-2 border-t">
        <InputGroup>
          <InputGroupAddon>
            <BotMessageSquare />
          </InputGroupAddon>
          <Separator
            orientation="vertical"
            className="ml-2 my-1 data-vertical:w-0.5 rounded-2xl"
          />
          <InputGroupInput
            type="text"
            placeholder="Enter your message..."
            value={input}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            onChange={(e) => setInput(e.target.value)}
          />
          <Separator orientation="vertical" />
          <Button
            className="rounded-r-2xl rounded-l-none bg-primary/60 hover:bg-primary/40 cursor-pointer pl-2.5 pr-3 text-foreground"
            variant="link"
            size="sm"
            onClick={handleSend}
          >
            <Send />
          </Button>
        </InputGroup>
      </SidebarFooter>
    </>
  );
}
