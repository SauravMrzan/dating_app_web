"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/lib/actions/auth-action";
import {
  Users,
  LayoutDashboard,
  UserPlus,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const logoutFormRef = useRef<HTMLFormElement>(null);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "User Management", icon: Users, path: "/admin/users" },
    { name: "Create User", icon: UserPlus, path: "/admin/users/create" },
  ];  

  const handleConfirmLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logoutFormRef.current?.requestSubmit();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* SIDEBAR - Clean, solid, and professional */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-50">
          <div className="bg-[#D32F2F] p-2 rounded-lg">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="font-bold text-gray-800 tracking-tight">
            Admin Portal
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#FEECEB] text-[#D32F2F]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

         {/* LOGOUT */}
        <div className="p-4 border-t border-gray-50">
          <form ref={logoutFormRef} action={handleLogout}>
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Exit Admin
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {pathname.split("/").pop()?.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">Admin Session</p>
              <p className="text-[10px] text-gray-400">System Controller</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300" />
          </div>
        </header>

        <section className="p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </section>
      </main>
    </div>
  );
}
