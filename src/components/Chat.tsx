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
      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChatbot}
        className="fixed bottom-8 right-8 z-50 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
      >
        {isVisible ? "Close Chat" : "Open Chat"}
      </Button>

      {/* Chat Interface */}
      {isVisible && (
        <Accordion type="single" collapsible className="relative z-40 flex">
          <AccordionItem
            value="item-1"
            className="fixed bottom-8 right-8 w-80 rounded-md border bg-background"
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
                  setMessages as React.Dispatch<React.SetStateAction<Message[]>>
                }
                isLoading={isLoading}
                messages={messages}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
