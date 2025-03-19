import { FormEvent, useState } from "react";
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
import { useTheme } from "next-themes"; // Import useTheme for theme detection

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

  const { theme } = useTheme(); // Get the current theme
  const { isVisible, toggleChatbot } = useChatbot(); // Add toggleVisibility from context

  // State to manage the accordion's open/close state
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e);
  };

  const handleButtonClick = () => {
    toggleChatbot(); // Toggle chatbot visibility
    setAccordionOpen(!accordionOpen); // Toggle accordion state
  };

  return (
    <>
      {/* Chat Interface */}
      <div className="fixed right-8 z-50">
        {/* Chat Toggle Button */}
        <Button
          onClick={handleButtonClick}
          style={{ zIndex: 100 }}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${
            theme === "dark"
              ? "bg-gray-200 text-black" // Light button for dark theme
              : "bg-gray-800 text-white" // Dark button for light theme
          } px-4 py-2 rounded-full shadow-lg`}
        >
          {isVisible ? (
            <MessageSquareX className="size-5" />
          ) : (
            <BotMessageSquare className="size-5" />
          )}
        </Button>

        {/* Chat Container */}
        {isVisible && (
          <Accordion
            type="single"
            collapsible
            className="relative z-40 flex"
            value={accordionOpen ? "item-1" : undefined} // Control accordion state
          >
            <AccordionItem
              value="item-1"
              className="w-80 rounded-md border bg-background"
            >
              {/* Accordion Trigger with Reverse Theme */}
              <AccordionTrigger
                className={`border-b px-6 py-2 font-semibold ${
                  theme === "dark"
                    ? "bg-gray-600 text-white" // Dark background and light text for dark theme
                    : "bg-gray-400 text-black" // Light background and dark text for light theme
                }`}
              >
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
