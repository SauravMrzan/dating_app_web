"use client";

import { useEffect, useState, useRef } from "react";
import axios from "@/lib/api/axios";
import Link from "next/link";
import {
  X,
  Heart,
  RotateCcw,
  Star,
  Info,
  MapPin,
  Sparkles,
  Search,
  Check
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

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

const SwipeCard = ({
  profile,
  isTop,
  onSwipe,
  triggerSwipe
}: {
  profile: any,
  isTop: boolean,
  onSwipe: (dir: "like" | "dislike") => void,
  triggerSwipe: "like" | "dislike" | null
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  useEffect(() => {
    if (isTop && triggerSwipe) {
      const targetX = triggerSwipe === "like" ? 500 : -500;
      x.set(targetX === 500 ? 1 : -1); // Set a small value to trigger direction in exit
      onSwipe(triggerSwipe);
    }
  }, [triggerSwipe, isTop, onSwipe, x]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("like");
    } else if (info.offset.x < -100) {
      onSwipe("dislike");
    }
  };

  return (
    <motion.div
      style={isTop ? { x, rotate, opacity } : { scale: 0.95, y: 10, opacity: 0.5 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: -1000, right: 1000 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.4, ease: "easeIn" }
      }}
    >
      <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-[var(--card-bg)]">
        <img
          src={profile.photos?.[0] ? `${process.env.NEXT_PUBLIC_API_URL || ""}/${profile.photos[0]}` : "/default-avatar.png"}
          alt={profile.fullName}
          className="w-full h-full object-cover"
        />

        {/* Swipe Indicators */}
        {isTop && (
          <>
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 border-4 border-green-500 rounded-xl px-4 py-2 rotate-[-20deg] z-20 pointer-events-none">
              <span className="text-4xl font-black text-green-500 uppercase">LIKE</span>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 border-4 border-rose-500 rounded-xl px-4 py-2 rotate-[20deg] z-20 pointer-events-none">
              <span className="text-4xl font-black text-rose-500 uppercase">NOPE</span>
            </motion.div>
          </>
        )}

        {/* Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 pt-20">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-3xl font-black text-white leading-tight">
                {profile.fullName}, {profile.age || (profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : "N/A")}
              </h3>
              <div className="flex items-center gap-2 text-white/80 mt-1 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>{profile.culture || "Nearby"}</span>
              </div>
            </div>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {profile.interests?.slice(0, 3).map((interest: string) => (
              <span key={interest} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-white/10">
                {interest}
              </span>
            ))}
            {profile.zodiac && (
              <span className="px-3 py-1 bg-rose-500/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-rose-300 tracking-widest border border-rose-500/20">
                {profile.zodiac}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CardStack = ({
  profiles,
  onSwipe,
  currentIndex,
  setCurrentIndex,
  triggerSwipe
}: {
  profiles: any[],
  onSwipe: (id: string, dir: "like" | "dislike") => void,
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  triggerSwipe: "like" | "dislike" | null
}) => {
  const handleSwipe = (dir: "like" | "dislike") => {
    onSwipe(profiles[currentIndex]._id, dir);
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= profiles.length) return null;

  return (
    <div className="relative w-full aspect-[3/4.5] max-w-sm mx-auto">
      <AnimatePresence mode="popLayout">
        {profiles.slice(currentIndex, currentIndex + 2).reverse().map((profile, index) => {
          const actualIndex = currentIndex + (profiles.slice(currentIndex, currentIndex + 2).length - 1 - index);
          const isTop = actualIndex === currentIndex;

          return (
            <SwipeCard
              key={profile._id}
              profile={profile}
              isTop={isTop}
              onSwipe={handleSwipe}
              triggerSwipe={isTop ? triggerSwipe : null}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};


export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerSwipe, setTriggerSwipe] = useState<"like" | "dislike" | null>(null);

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

  const handleSwipe = async (toUserId: string, status: "like" | "dislike") => {
    try {
      setTriggerSwipe(null); // Reset trigger
      await axios.post("/api/match/swipe", { toUserId, status });
    } catch {
      console.error("Swipe failed");
    }
  };

  const handleManualSwipe = (dir: "like" | "dislike") => {
    if (currentIndex < profiles.length) {
      setTriggerSwipe(dir);
    }
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading)
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </motion.div>
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 border-2 border-rose-500/20 rounded-full"
          />
        </div>
      </div>
    );

  return (
    <div className="max-w-md mx-auto h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 pt-2">
        <div>
          <h2 className="text-3xl font-black text-gradient italic tracking-tighter">Discover</h2>
          <p className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-[0.2em]">New people nearby</p>
        </div>
        <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[var(--text-secondary)] hover:text-rose-500 transition-colors">
          <Search className="w-6 h-6" />
        </button>
      </div>

      {errorMessage ? (
        <div className="card-premium p-10 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
            <Info className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black">Profile Incomplete</h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium">To keep things fair, you need to add at least one photo and a bio before you can see others.</p>
          </div>
          <Link
            href="/dashboard/profile"
            className="btn-primary w-full"
          >
            Finish Profile
          </Link>
        </div>
      ) : profiles.length > 0 ? (
        <div className="flex-1 flex flex-col gap-10">
          <CardStack
            profiles={profiles}
            onSwipe={handleSwipe}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            triggerSwipe={triggerSwipe}
          />

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-6 pb-10">
            <button
              onClick={handleRewind}
              className="w-14 h-14 glass rounded-full flex items-center justify-center text-yellow-500 hover:scale-110 active:scale-95 transition-all shadow-lg"
              title="Undo last swipe"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleManualSwipe("dislike")}
              className="w-20 h-20 glass rounded-full flex items-center justify-center text-rose-500 shadow-xl border border-rose-500/10 hover:scale-110 active:scale-95 transition-all"
              title="Dislike"
            >
              <X className="w-10 h-10 stroke-[3px]" />
            </button>
            <button
              onClick={() => handleManualSwipe("like")}
              className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:scale-110 active:scale-95 transition-all"
              title="Like"
            >
              <Heart className="w-10 h-10 fill-current" />
            </button>
            <button
              className="w-14 h-14 glass rounded-full flex items-center justify-center text-purple-500 hover:scale-110 active:scale-95 transition-all shadow-lg"
              title="Super Like"
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      ) : (
        <div className="card-premium p-12 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-[var(--text-secondary)]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black">No more sparks!</h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium">You&apos;ve seen everyone in your area. Try expanding your search distance or check back later.</p>
          </div>
          <button
            onClick={() => setCurrentIndex(0)}
            className="btn-primary flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Re-shuffle</span>
          </button>
        </div>
      )}
    </div>
  );
}