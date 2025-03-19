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
        {/* Chat Toggle Button */}
        <Button
          onClick={toggleChatbot}
          style={{ zIndex: 100 }}
          className={`absolute right-2 transform transition-transform duration-300 ${
            isVisible ? "translate-y-[-3rem]" : "translate-y-[-5rem]"
          } bg-gray-800 text-white dark:bg-gray-200 dark:text-black px-4 py-2 rounded-full shadow-lg`}
        >
          {isVisible ? (
            <MessageSquareX className="size-5" />
          ) : (
            <BotMessageSquare className="size-5" />
          )}
        </Button>

        {isVisible && (
          <Accordion type="single" collapsible className="relative z-40 flex">
            <AccordionItem
              value="item-1"
              className="w-80 rounded-md border bg-background"
            >
              <AccordionTrigger className="border-b px-6">
                <ChatHeader />
              </AccordionTrigger>
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
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </>
  );
}
