"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BotMessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { UserAvatar } from "@/components/user-avatar";

type MessageSender = "ai" | "user";

type ChatMessage = {
  id: string;
  sender: MessageSender;
  text: string;
};

const STARTER_MESSAGE: ChatMessage = {
  id: "m-0",
  sender: "ai",
  text: "Hi! I am your AI assistant. Ask me anything about your expenses.",
};

const GENERIC_RESPONSES = [
  "Nice one. Want me to turn that into a tracked action?",
  "I can help break that into smaller steps if you want.",
  "Good direction. Should I suggest a practical next move?",
  "Interesting thought. I can compare options for you.",
  "That makes sense. Want a quick summary or a deeper plan?",
] as const;

const BUDGET_RESPONSES = [
  "Try a 50/30/20 split for this month and review after one week.",
  "A small cap on food delivery often creates fast savings.",
  "Set category limits first, then track daily deltas for consistency.",
] as const;

const CATEGORY_RESPONSES = [
  "You can start with fixed vs variable categories for clearer reports.",
  "If categories are noisy, merge low-volume ones into an 'Other' bucket.",
  "Try keeping 6-10 categories max to reduce decision fatigue.",
] as const;

const TRANSACTION_RESPONSES = [
  "For transactions, include merchant, amount, and category as required fields.",
  "Weekly transaction reviews usually catch leaks faster than monthly reviews.",
  "You can flag unusual transactions above your personal threshold.",
] as const;

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildLocalAiResponse(userMessage: string): string {
  const normalized = userMessage.trim().toLowerCase();

  if (/budget|save|saving|spend/.test(normalized)) {
    return pickRandom(BUDGET_RESPONSES);
  }

  if (/category|categories|tag/.test(normalized)) {
    return pickRandom(CATEGORY_RESPONSES);
  }

  if (/transaction|payment|expense/.test(normalized)) {
    return pickRandom(TRANSACTION_RESPONSES);
  }

  const shortEcho = userMessage.trim().slice(0, 70);
  return `${pickRandom(GENERIC_RESPONSES)}${shortEcho ? `\n\nYou said: "${shortEcho}"` : ""}`;
}

export default function ChatBox({ user }: { user: User }) {
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageIdRef = useRef(1);
  const typingTimeoutRef = useRef<number | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const getNextMessageId = useCallback(() => {
    return `m-${messageIdRef.current++}`;
  }, []);

  const scheduleAiReply = useCallback(
    (userMessage: string) => {
      setIsTyping(true);
      const replyDelayMs = 700 + Math.floor(Math.random() * 900);

      typingTimeoutRef.current = window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: getNextMessageId(),
            sender: "ai",
            text: buildLocalAiResponse(userMessage),
          },
        ]);
        setIsTyping(false);
        typingTimeoutRef.current = null;
      }, replyDelayMs);
    },
    [getNextMessageId],
  );

  const handleSend = useCallback(() => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: getNextMessageId(), sender: "user", text: trimmedInput },
    ]);
    setInput("");
    scheduleAiReply(trimmedInput);
  }, [getNextMessageId, input, isTyping, scheduleAiReply]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isTyping, messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <>
      <SidebarContent className="px-2 py-5 space-y-2 overflow-y-auto text-sm">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "space-x-2",
              message.sender === "ai" ? "self-start flex" : "flex justify-end",
            )}
          >
            {message.sender === "ai" && (
              <span className="rounded-xl bg-foreground/20 dark:bg-foreground/10 p-2 h-fit align-top">
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

        <div ref={endOfMessagesRef} />
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            onChange={(e) => setInput(e.target.value)}
          />
          <Separator orientation="vertical" />
          <Button
            className="rounded-r-2xl rounded-l-none bg-primary/60 hover:bg-primary/40 cursor-pointer pl-2.5 pr-3 text-foreground"
            variant="link"
            size="sm"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
          >
            <Send />
          </Button>
        </InputGroup>
      </SidebarFooter>
    </>
  );
}
