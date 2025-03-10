import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
// import AIChatButton from "./AIChatButton";
const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/75 py-6 backdrop-blur-sm">
      <nav className="flex items-center justify-between">
        <ul className="flex gap-4 sm:gap-8">
          {navLinks.map((nav, id) => (
            <li key={id} className="link">
              <Link href={nav.href}>{nav.name}</Link>
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
