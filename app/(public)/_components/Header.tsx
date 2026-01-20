"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#F3C1C8] bg-white/90 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logoright.png"
            alt="Mannmilap Logo"
            width={90}
            height={90}
            priority
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 font-medium text-blue-300">
          <Link href="#features" className="hover:text-[#C8344A]">
            Features
          </Link>
          <Link href="#about" className="hover:text-[#C8344A]">
            About
          </Link>
          <Link href="/login" className="hover:text-[#C8344A]">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#C8344A] px-5 py-2 text-white font-semibold hover:bg-[#B52E42] transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-[#C8344A]">
            Login
          </Link>
          <button onClick={() => setOpen(!open)}>☰</button>
        </div>
      </nav>
    </header>
  );
}
