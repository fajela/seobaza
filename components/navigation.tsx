"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

// Prefetch посилання для швидшої навігації
const NavLink = ({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className: string;
}) => (
  <Link href={href} prefetch={true} className={className} onClick={onClick}>
    {children}
  </Link>
);

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-theme">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-display font-bold text-foreground group-hover:text-accent transition-colors">
              SEO BAZA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              href="/articles"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Статті
            </NavLink>
            <NavLink
              href="/knowledge-base"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              База знань
            </NavLink>
            <NavLink
              href="/test"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Тести
            </NavLink>
            <NavLink
              href="/events"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Події
            </NavLink>
            <NavLink
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Контакт
            </NavLink>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-in-right">
            <div className="flex flex-col space-y-3">
              <NavLink
                href="/articles"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Статті
              </NavLink>
              <NavLink
                href="/knowledge-base"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                База знань
              </NavLink>
              <NavLink
                href="/test"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Тести
              </NavLink>
              <NavLink
                href="/events"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Події
              </NavLink>
              <NavLink
                href="/contact"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Контакт
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
