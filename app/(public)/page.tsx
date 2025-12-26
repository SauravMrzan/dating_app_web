import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF1F3] text-[#4A1D24]">
      {/* Header */}
      <header className="border-b border-[#F3C1C8] bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logoright.png"
              alt="Mannmilap Logo"
              width={90}
              height={90}
              priority
            />
          </div>

          <nav className="hidden md:flex items-center gap-6 font-medium">
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
          </nav>

          <div className="md:hidden">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#C8344A]"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center py-20 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-lg text-center">
          <p className="text-lg font-semibold text-[#7A2E3A]">
            This is a dummy page for now
          </p>
        </div>
      </main>

      {/* Hero */}
      {/* <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97385]/20 text-[#C8344A] text-sm font-medium">
            Join thousands finding meaningful connections
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Connect with Culture, Build with{" "}
            <span className="text-[#C8344A]">Heart</span>
          </h1>

          <p className="text-lg md:text-xl text-[#7A2E3A] max-w-2xl mx-auto">
            MannMilap brings together the Nepalese community for meaningful
            relationships rooted in shared values and culture.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="rounded-xl bg-[#C8344A] px-8 py-3 text-lg font-semibold text-white hover:bg-[#B52E42] transition"
            >
              Start Your Journey
            </Link>

            <Link
              href="#features"
              className="rounded-xl border border-[#C8344A] px-8 py-3 text-lg font-semibold text-[#C8344A] hover:bg-[#C8344A]/10 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#C8344A]">
              Why Choose MannMilap?
            </h2>
            <p className="text-[#7A2E3A] max-w-2xl mx-auto">
              Built with respect for culture and meaningful connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Cultural Values",
                desc: "Shared traditions & respect",
                icon: "🌸",
              },
              {
                title: "Meaningful Matches",
                desc: "Compatibility over swipes",
                icon: "🤝",
              },
              {
                title: "Safe & Secure",
                desc: "Privacy-first verified profiles",
                icon: "🛡️",
              },
              {
                title: "Authentic Connections",
                desc: "Real bonds that last",
                icon: "✨",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#FFF1F3] rounded-2xl p-6 border border-[#F3C1C8] hover:shadow-md transition space-y-3"
              >
                <div className="text-3xl">{item.icon}</div>
                <h3 className="text-xl font-semibold text-[#C8344A]">
                  {item.title}
                </h3>
                <p className="text-[#7A2E3A]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* About */}
      {/* <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#C8344A]">
            Built for the Nepalese Community
          </h2>
          <p className="text-lg text-[#7A2E3A]">
            MannMilap understands the importance of culture, values, and family
            when forming meaningful relationships.
          </p>
        </div>
      </section> */}

      {/* CTA */}
      {/* <section className="bg-[#F97385]/20 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A1D24]">
            Ready to Find Your Connection?
          </h2>
          <p className="text-lg text-[#7A2E3A]">
            Join MannMilap today and start your journey
          </p>
          <Link
            href="/register"
            className="inline-block rounded-xl bg-[#C8344A] px-8 py-3 text-lg font-semibold text-white hover:bg-[#B52E42] transition"
          >
            Create Your Profile
          </Link>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-[#F3C1C8] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logoright.png"
              alt="Mannmilap Logo"
              width={80}
              height={80}
            />
          </div>
          <p className="text-sm text-[#7A2E3A]">
            © 2025 MannMilap — Connecting hearts with culture
          </p>
        </div>
      </footer>
    </div>
  );
}
