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
    </div>
  );
}
