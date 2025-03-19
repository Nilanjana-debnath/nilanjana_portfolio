import { FormEvent } from "react";
import { useChatbot } from "@/contexts/ChatContext";
import { useChat } from "ai/react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";
import { Message } from "ai";
import { Button } from "./ui/Button"; // Import your Button component
import { BotMessageSquare, MessageSquareX } from "lucide-react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const { isVisible, toggleChatbot } = useChatbot(); // Add toggleVisibility from context

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e);
  };

  return (
    <>
      {/* Chat Interface */}
      <div
        className={`fixed right-8 z-50 transition-all duration-300 ${
          isVisible ? "bottom-8" : "bottom-8"
        }`}
      >
        <Accordion type="single" collapsible className="relative z-40 flex">
          <AccordionItem
            value="item-1"
            className="w-80 rounded-md border bg-background"
          >
            {/* Accordion Trigger with Toggle Button */}
            <AccordionTrigger className="border-b px-6 flex items-center justify-between">
              <ChatHeader />
              <Button
                onClick={toggleChatbot}
                className="bg-blue-500 text-white px-2 py-1 rounded-full shadow-md"
              >
                {isVisible ? (
                  <MessageSquareX className="size-5" />
                ) : (
                  <BotMessageSquare className="size-5" />
                )}
              </Button>
            </AccordionTrigger>

            {/* Accordion Content */}
            {isVisible && (
              <AccordionContent className="flex max-h-96 min-h-80 flex-col justify-between p-0">
                <ChatMessages
                  messages={messages}
                  error={error}
                  isLoading={isLoading}
                />
                <ChatInput
                  input={input}
                  handleSubmit={handleSubmit}
                  handleInputChange={handleInputChange}
                  setMessages={
                    setMessages as React.Dispatch<
                      React.SetStateAction<Message[]>
                    >
                  }
                  isLoading={isLoading}
                  messages={messages}
                />
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
