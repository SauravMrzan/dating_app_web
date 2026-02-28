"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-around bg-gray-800 text-white p-4">
        <Link
          href="/dashboard/profile"
          className={pathname.includes("profile") ? "font-bold" : ""}
        >
          Profile
        </Link>
        <Link
          href="/dashboard/discover"
          className={pathname.includes("discover") ? "font-bold" : ""}
        >
          Discover
        </Link>
        <Link
          href="/dashboard/matches"
          className={pathname.includes("matches") ? "font-bold" : ""}
        >
          Matches
        </Link>
        <Link
          href="/dashboard/chat"
          className={pathname.includes("chat") ? "font-bold" : ""}
        >
          Chat
        </Link>
        <Link
          href="/dashboard/settings"
          className={pathname.includes("settings") ? "font-bold" : ""}
        >
          Settings
        </Link>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
