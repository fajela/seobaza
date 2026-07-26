'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <img
              src="https://seobaza.com.ua/seobaza-super-small.png"
              alt="SEO BAZA"
              className="h-6 w-auto"
            />
            <span className="text-sm font-semibold text-black dark:text-white">
              SEO BAZA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/articles"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Статті
            </Link>
            <Link
              href="/black-friday"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Чорна п'ятниця
            </Link>
            <a
              href="https://seobaza.com.ua/quality-raters-guidelines-short-ukrainian.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Указівки
            </a>
            <Link
              href="/contact"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Контакт
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-gray-200">
            <Link
              href="/black-friday"
              className="block py-2 text-text-primary hover:text-primary font-semibold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Чорна п'ятниця 2025
            </Link>
            <Link
              href="/articles"
              className="block py-2 text-text-primary hover:text-primary font-semibold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Статті
            </Link>
            <a
              href="https://seobaza.com.ua/quality-raters-guidelines-short-ukrainian.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-text-primary hover:text-primary font-semibold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Указівки для асесорів
            </a>
            <Link
              href="/contact"
              className="block py-2 text-text-primary hover:text-primary font-semibold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакт
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
