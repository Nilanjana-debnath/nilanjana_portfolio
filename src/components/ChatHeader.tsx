import { useTheme } from "next-themes";

export default function ChatHeader() {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div
      className={`p-4 text-lg font-semibold ${
        theme === "dark"
          ? "bg-gray-200 text-black" // Light background and dark text for dark theme
          : "bg-gray-800 text-white" // Dark background and light text for light theme
      }`}
    >
      Chat with Nilanjana
    </div>
  );
}
