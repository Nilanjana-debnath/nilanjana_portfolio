import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
// import AIChatButton from "./AIChatButton";
import { Home, Briefcase, Contact, BookOpen, Box } from "lucide-react";

const navLinks = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Briefcase,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Contact,
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/75 py-6 backdrop-blur-sm">
      <nav className="flex items-center justify-between">
        <ul className="flex gap-4 sm:gap-8">
          {navLinks.map((nav, id) => (
            <li key={id} className="link flex items-center gap-2">
              <Link href={nav.href} className="flex items-center gap-2">
                <nav.icon className="w-5 h-5" />
                {nav.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-0 sm:gap-4">
          <ChatToggle />
          {/* <AIChatButton/> */}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
