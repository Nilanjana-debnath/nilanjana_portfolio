import { ChatRequestOptions, Message } from "ai";
import { SendHorizontal, Trash } from "lucide-react";
import { HTMLAttributes, FormEvent } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface ChatInputProps {
  input: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  messages: Message[];
}

export default function ChatInput({
  input,
  handleSubmit,
  handleInputChange,
  setMessages,
  isLoading,
  messages,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="m-3 flex gap-1">
      <input
        value={input}
        onChange={handleInputChange}
        placeholder="Say something..."
        className="flex-grow rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="flex w-10 flex-none items-center justify-center disabled:opacity-50 hover:text-blue-400 transition-colors duration-300"
        disabled={input.length === 0}
        title="Submit message"
      >
        <SendHorizontal size={24} />
      </button>
    </form>
  );
}
