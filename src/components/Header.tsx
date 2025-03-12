import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
// import AIChatButton from "./AIChatButton";
import { Home, Briefcase, Contact, BookOpen, Box, icons, Boxes } from "lucide-react";

const navLinks = [
  {
    name: "Home",
    href: "/",
    icon: Home
  },
  {
    name: "Skills",
    href: "/skills",
    icon: Boxes
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Briefcase
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Contact
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/75 py-4 sm:py-6 backdrop-blur-sm">
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6">
        <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-8">
          {navLinks.map((nav, id) => (
            <li key={id} className="link">
              <Link href={nav.href} className="relative px-3 py-2 rounded-md text-sm font-medium group flex items-center">
                <nav.icon className="w-5 h-5 mr-2" />
                {nav.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-0">
          <ChatToggle />
          {/* <AIChatButton/> */}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
