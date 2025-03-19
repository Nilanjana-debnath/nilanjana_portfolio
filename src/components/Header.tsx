"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { Home, Briefcase, Boxes, Contact } from "lucide-react";
import { useTheme } from "next-themes"; // Import useTheme for theme detection

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Skills", href: "/skills", icon: Boxes },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Contact", href: "/contact", icon: Contact },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme(); // Get the current theme
  // Determine the logo based on the theme
  const logoSrc =
  theme === "dark" || resolvedTheme === "dark"
    ? "/logo_white.ico"
    : "/favicon.ico";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <nav className="mx-auto max-w-full px-0 ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold">
              <img
                src={logoSrc} // Change logo based on theme
                alt="Nilanjana"
                width={40}
                height={40}
                className="m-0 p-0"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-3 py-2 rounded-md text-sm font-medium group flex items-center"
                >
                  <link.icon className="w-5 h-5 mr-2" />
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100"
                    layoutId="underline"
                  />
                </Link>
              ))}
            </div>

            {/* Theme Toggle for Desktop */}
            <ThemeToggle />
          </div>

          {/* Theme Toggle and Hamburger Menu for Mobile */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          className="md:hidden backdrop-blur-md bg-opacity-70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}