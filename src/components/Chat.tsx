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

  const { isVisible } = useChatbot();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e);
  };

  return (
    isVisible && (
      <Accordion type="single" collapsible className="relative z-40 flexs">
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
              setMessages={setMessages as React.Dispatch<React.SetStateAction<Message[]>>}
              isLoading={isLoading}
              messages={messages}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  );
}
