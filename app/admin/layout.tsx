import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Navigation tailored for a Dating App Admin
  const menuItems = [
    { name: "Overview", path: "/admin", icon: "💎" },
    { name: "Manage Profiles", path: "/admin/users", icon: "🔥" },
    { name: "Manual Registry", path: "/admin/users/create", icon: "👤" },
    { name: "Safety Reports", path: "/admin/reports", icon: "🛡️" }, // Added for Dating App context
  ];

  return (
    <div className="flex min-h-screen bg-#050505 text-white">
      {/* Sidebar - Sticky and Scannable */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] p-6 fixed h-full z-50">
        <div className="mb-12 px-2">
          {/* Brand Identity */}
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 font-extrabold text-2xl tracking-tighter">
            DATESYNC
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
              Admin Authority
            </p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent transition-all duration-300 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-semibold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout/Exit Section */}
        <div className="absolute bottom-10 left-6 right-6 pt-6 border-t border-white/5">
          <Link 
            href="/user/profile" 
            className="flex items-center gap-2 text-[11px] text-gray-500 hover:text-rose-400 transition-colors"
          >
            <span>🔓</span> Exit to User View
          </Link>
        </div>
      </aside>

      {/* Main Terminal View */}
      <main className="flex-1 ml-64 bg-[#050505]">
        {/* Top Header for Context */}
        <header className="h-16 border-b border-white/5 flex items-center justify-end px-10 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-40">
           <div className="flex items-center gap-3">
             <div className="text-right">
               <p className="text-[10px] text-gray-500 font-bold uppercase">System Admin</p>
               <p className="text-xs font-medium text-gray-300">Live Server v1.0</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 border border-white/20" />
           </div>
        </header>

        <section className="p-8 max-w-7xl mx-auto">
          {children}
        </section>
      </main>
    </div>
  );
}