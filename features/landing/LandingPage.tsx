"use client";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF1F3] text-[#4A1D24]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#F3C1C8]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logoright.png"
              alt="MannMilap Logo"
              width={40}
              height={40}
            />
            <span className="font-bold text-lg text-[#C8344A]">
              MannMilap
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex gap-8 text-sm font-semibold text-[#4A1D24]">
            <a href="#features" className="hover:text-[#C8344A] transition">
              Why Us
            </a>
            <a href="#safety" className="hover:text-[#C8344A] transition">
              Safety
            </a>
            <a href="#about" className="hover:text-[#C8344A] transition">
              About
            </a>
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="rounded-xl bg-[#C8344A] px-6 py-2 text-sm font-semibold text-white hover:bg-[#B52E42] transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">

          <span className="inline-block px-6 py-2 rounded-full bg-[#F97385]/20 text-[#C8344A] text-sm font-semibold">
            Trusted Nepalese Dating Platform
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Where Nepalese Hearts <br />
            Connect with{" "}
            <span className="text-[#C8344A]">Respect & Meaning</span>
          </h1>

          <p className="text-lg md:text-xl text-[#7A2E3A] max-w-2xl mx-auto">
            MannMilap helps you build meaningful relationships rooted in
            culture, family values, and trust — not endless swiping.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="rounded-xl bg-[#C8344A] px-10 py-4 text-lg font-semibold text-white hover:bg-[#B52E42] transition"
            >
              Start Your Journey
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-[#C8344A] px-10 py-4 text-lg font-semibold text-[#C8344A] hover:bg-[#C8344A]/10 transition"
            >
              Learn More
            </a>
          </div>

          <p className="text-sm text-[#7A2E3A] mt-2">
            🔒 Profiles reviewed • Privacy respected
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-[#C8344A]">
              Why Choose MannMilap?
            </h2>
            <p className="text-[#7A2E3A] max-w-2xl mx-auto">
              Built for serious, respectful, and meaningful connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Cultural Values", desc: "Respect for traditions & families", icon: "🌸" },
              { title: "Meaningful Matches", desc: "Compatibility over swipes", icon: "🤝" },
              { title: "Privacy First", desc: "Your data stays protected", icon: "🛡️" },
              { title: "Real Intentions", desc: "No fake or casual profiles", icon: "✨" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#FFF1F3] rounded-2xl p-8 border border-[#F3C1C8] hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-[#C8344A] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#7A2E3A]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section id="safety" className="py-24 bg-[#F97385]/15">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trust & Safety First
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Verified user profiles",
              "Strict community guidelines",
              "Privacy-focused data protection",
            ].map((text) => (
              <div
                key={text}
                className="bg-white rounded-2xl p-8 border border-[#F3C1C8] font-semibold text-[#7A2E3A]"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#C8344A]">
            Built for the Nepalese Community
          </h2>
          <p className="text-lg text-[#7A2E3A]">
            MannMilap understands the importance of culture, family,
            and shared values when forming lifelong relationships.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#F3C1C8] bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <Image
              src="/images/logoright.png"
              alt="MannMilap Logo"
              width={36}
              height={36}
            />
            <span className="font-bold text-sm text-[#C8344A]">
              MannMilap
            </span>
          </div>

          <p className="text-xs text-[#7A2E3A]">
            © 2025 MannMilap. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";

// export default function Header() {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="border-b border-[#F3C1C8] bg-white/90 backdrop-blur sticky top-0 z-50">
//       <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <Image
//             src="/images/logoright.png"
//             alt="Mannmilap Logo"
//             width={90}
//             height={90}
//             priority
//           />
//         </div>

//         {/* Desktop Nav */}
//         <div className="hidden md:flex items-center gap-6 font-medium text-blue-300">
//           <Link href="#features" className="hover:text-[#C8344A]">
//             Features
//           </Link>
//           <Link href="#about" className="hover:text-[#C8344A]">
//             About
//           </Link>
//           <Link href="/login" className="hover:text-[#C8344A]">
//             Login
//           </Link>
//           <Link
//             href="/register"
//             className="rounded-lg bg-[#C8344A] px-5 py-2 text-white font-semibold hover:bg-[#B52E42] transition"
//           >
//             Get Started
//           </Link>
//         </div>

//         {/* Mobile */}
//         <div className="md:hidden flex items-center gap-3">
//           <Link href="/login" className="text-sm font-semibold text-[#C8344A]">
//             Login
//           </Link>
//           <button onClick={() => setOpen(!open)}>☰</button>
//         </div>
//       </nav>
//     </header>
//   );
// }
