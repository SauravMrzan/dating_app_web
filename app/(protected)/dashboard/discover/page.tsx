"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import Link from "next/link";

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/match/discovery");
        setProfiles(res.data.data || []);
        setErrorMessage(null);
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const swipe = async (toUserId: string, status: "like" | "dislike") => {
    try {
      setProfiles((prev) => prev.filter((p) => p._id !== toUserId));
      await axios.post("/api/match/swipe", { toUserId, status });
    } catch {
      alert("Action failed. Try again.");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-bounce text-rose-500 font-black text-2xl italic">
          FINDING MATCHES...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-black italic text-black tracking-tighter">
          Discover
        </h2>
        <div className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          {profiles.length} Nearby
        </div>
      </div>

      {errorMessage ? (
        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-xl text-center border border-rose-100">
          <div className="text-5xl mb-4">👀</div>
          <h3 className="text-black font-black text-xl mb-2">Profile Incomplete!</h3>
          <p className="text-gray-500 text-sm font-medium mb-6">
            You need to add a photo and bio before you can see who's out there.
          </p>
          <Link
            href="/profile"
            className="inline-block bg-black text-white px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform"
          >
            COMPLETE PROFILE
          </Link>
        </div>
      ) : profiles.length > 0 ? (
        <div className="relative w-full max-w-100 aspect-9/16 group">
          {profiles.slice(0, 1).map((p) => {
            const slides = [
              {
                photo: p.photos?.[0],
                content: (
                  <>
                    <h3 className="text-3xl font-black">
                      {p.fullName},{" "}
                      {p.age || (p.dateOfBirth ? calculateAge(p.dateOfBirth) : "N/A")}
                    </h3>
                    <p className="text-sm font-medium opacity-90 mt-1 line-clamp-2">
                      {p.bio || "No bio yet..."}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        {p.culture || "Nepal"}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        {p.zodiac || "Star"}
                      </span>
                    </div>
                  </>
                ),
              },
              {
                photo: p.photos?.[1],
                content: (
                  <>
                    <p className="text-sm font-medium opacity-90 mt-1">
                      Interests: {p.interests?.length ? p.interests.join(", ") : "Not specified"}
                    </p>
                    <p className="text-sm font-medium opacity-90 mt-1">
                      Height: {p.height || "N/A"} cm
                    </p>
                  </>
                ),
              },
              {
                photo: p.photos?.[2],
                content: (
                  <>
                    <p className="text-sm font-medium opacity-90 mt-1">
                      Education: {p.education || "N/A"}
                    </p>
                    <p className="text-sm font-medium opacity-90 mt-1">
                      Family Plan: {p.familyPlan || "N/A"}
                    </p>
                  </>
                ),
              },
            ];

            return (
              <div
                key={p._id}
                className="relative w-full h-full bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-white animate-in fade-in zoom-in duration-300"
              >
                <img
                  src={
                    slides[slideIndex].photo
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${slides[slideIndex].photo}`
                      : "/default-avatar.png"
                  }
                  alt={p.fullName}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />

                {/* User Info */}
                <div className="absolute bottom-24 left-6 right-6 text-white">
                  {slides[slideIndex].content}
                </div>

                {/* Carousel Navigation */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                  <button
                    onClick={() =>
                      setSlideIndex((slideIndex - 1 + slides.length) % slides.length)
                    }
                    className="bg-white rounded-full p-2 shadow hover:scale-110 transition"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => setSlideIndex((slideIndex + 1) % slides.length)}
                    className="bg-white rounded-full p-2 shadow hover:scale-110 transition"
                  >
                    ▶
                  </button>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
                  <button
                    onClick={() => swipe(p._id, "dislike")}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-100 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
                  >
                    ✖
                  </button>
                  <button
                    onClick={() => swipe(p._id, "like")}
                    className="w-16 h-16 bg-linear-to-br from-rose-500 to-orange-400 rounded-full flex items-center justify-center shadow-xl text-white hover:scale-110 active:scale-95 transition-all"
                  >
                    ❤
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🏜️</span>
          </div>
          <h3 className="text-black font-black text-xl">No one new!</h3>
          <p className="text-gray-400 text-sm mt-2">
            Try expanding your search distance or preferences.
          </p>
        </div>
      )}
    </div>
  );
}