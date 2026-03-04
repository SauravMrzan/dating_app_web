"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import {
  Camera,
  User,
  Target,
  Info,
  Save,
  Calendar,
  MapPin,
  ChevronRight,
  Heart,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/utils/image";
import { useAuthOptions } from "@/lib/hooks/useAuthOptions";

const parseArrayLike = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
    return [String(parsed).trim()].filter(Boolean);
  } catch {}

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => item.trim().replace(/^['\"]|['\"]$/g, ""))
      .filter(Boolean);
  }

  return [trimmed];
};

export default function ProfilePage() {
  const router = useRouter();
  const { options } = useAuthOptions();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    culture: "",
    interestedIn: "",
    preferredCulture: [],
    minPreferredAge: 18,
    maxPreferredAge: 99,
    bio: "",
    interests: [],
    height: "",
    zodiac: "",
    education: "",
    familyPlan: "",
    photos: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"basics" | "discovery" | "about">(
    "basics",
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/auth/whoami");
        const userData = res.data.data;
        const normalizedCulture = parseArrayLike(userData.culture)[0] || "";
        const normalizedPreferredCulture = parseArrayLike(
          userData.preferredCulture,
        );

        setUser(userData);
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth?.slice(0, 10) || "",
          culture: normalizedCulture,
          interestedIn: userData.interestedIn || "",
          preferredCulture: normalizedPreferredCulture,
          minPreferredAge: userData.minPreferredAge || 18,
          maxPreferredAge: userData.maxPreferredAge || 99,
          bio: userData.bio || "",
          interests: userData.interests || [],
          height: userData.height || "",
          zodiac: userData.zodiac || "",
          education: userData.education || "",
          familyPlan: userData.familyPlan || "",
          photos: [],
        });
      } catch {
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value
      ? e.target.value.split(",").map((i) => i.trim())
      : [];
    setFormData((prev: any) => ({ ...prev, interests }));
  };

  const handlePreferredCultureChange = (culture: string) => {
    setFormData((prev: any) => {
      const selected = prev.preferredCulture || [];
      return selected.includes(culture)
        ? {
            ...prev,
            preferredCulture: selected.filter((c: string) => c !== culture),
          }
        : { ...prev, preferredCulture: [...selected, culture] };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setFormData((prev: any) => ({ ...prev, photos: files }));
      previewPhotos.forEach((url) => URL.revokeObjectURL(url));
      setPreviewPhotos(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setErrors([]);

    try {
      const data = new FormData();
      if (formData.photos.length > 0) {
        formData.photos.forEach((file: File) => data.append("photos", file));
      }
      Object.keys(formData).forEach((key) => {
        if (key === "photos") return;
        const value = formData[key];

        if (value === undefined || value === null) return;

        if (key === "culture" && Array.isArray(value)) {
          if (value[0]) {
            data.append(key, value[0]);
          }
          return;
        }

        if (typeof value === "string" && value.trim() === "") {
          return;
        }

        if (Array.isArray(value)) {
          // if (key === "preferredCulture") {
          //   value
          //     .filter((item) => typeof item === "string" && item.trim() !== "")
          //     .forEach((item) => data.append(key, item));
          //   return;
          // }

          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      console.log(data, "ddd");

      await axios.put("/api/auth/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (error: any) {
      const backendError = error.response?.data;
      if (backendError?.errors) {
        setErrors(backendError.errors.map((err: any) => err.message || err));
      } else if (backendError?.message) {
        setErrors([backendError.message]);
      } else {
        setErrors(["Unexpected error. Please check your inputs."]);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"
          />
          <p className="font-bold text-rose-500 animate-pulse">
            Setting up your profile...
          </p>
        </div>
      </div>
    );
  }

  const SectionTitle = ({ icon: Icon, title, subtitle }: any) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-black text-(--text-main) leading-none mb-1">
          {title}
        </h3>
        <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest">
          {subtitle}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero Header */}
      <div className="relative mb-8 text-center pt-4">
        <h1 className="text-4xl font-black text-gradient italic mb-2">
          Edit My Profile
        </h1>
        <p className="text-(--text-secondary) font-medium">
          Fine-tune your vibe and find your spark.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo Section */}
        <section className="card-premium p-6">
          <SectionTitle
            icon={Camera}
            title="Your Photos"
            subtitle="Showcase your best self"
          />
          <div className="grid grid-cols-3 gap-4">
            <label className="aspect-3/4 bg-(--bg-secondary) border-2 border-dashed border-(--border-color) rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-rose-500/5 transition-all group overflow-hidden relative">
              <Camera className="w-8 h-8 text-(--text-secondary) group-hover:text-rose-500 transition-colors" />
              <span className="text-[10px] font-black uppercase mt-2 text-(--text-secondary) group-hover:text-rose-500 transition-colors">
                Add Photo
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <AnimatePresence>
              {previewPhotos.map((src, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`preview-${idx}`}
                  className="aspect-[3/4] rounded-3xl overflow-hidden relative border-2 border-rose-500 shadow-lg shadow-rose-500/20"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                  <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
              {previewPhotos.length === 0 &&
                user?.photos?.map((photo: string, idx: number) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`saved-${idx}`}
                    className="aspect-[3/4] rounded-3xl overflow-hidden relative group"
                  >
                    <img
                      src={getImageUrl(photo)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt="saved"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] mt-4 font-bold text-center uppercase tracking-wider">
            Add up to 3 high-quality photos for better match rates
          </p>
        </section>

        {/* Form Content */}
        <div className="card-premium overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-(--border-color)">
            {[
              { id: "basics", icon: User, label: "Basics" },
              { id: "discovery", icon: Target, label: "Discovery" },
              { id: "about", icon: Info, label: "About" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-black uppercase tracking-tighter transition-all relative ${
                  activeTab === tab.id
                    ? "text-rose-500"
                    : "text-(--text-secondary)"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="profile-tab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "basics" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-(--text-secondary) flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input-modern"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-(--text-secondary) flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Birthday
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="input-modern"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-(--text-secondary) flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="input-modern"
                      >
                        <option value="">Select</option>
                        {options.genders.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-(--text-secondary) flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Culture
                      </label>
                      <select
                        name="culture"
                        value={formData.culture}
                        onChange={handleChange}
                        className="input-modern"
                      >
                        <option value="">Select</option>
                        {options.cultures.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "discovery" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-(--text-secondary) flex items-center gap-2">
                      <Heart className="w-3 h-3" /> Interested In
                    </label>
                    <select
                      name="interestedIn"
                      value={formData.interestedIn}
                      onChange={handleChange}
                      className="input-modern"
                    >
                      <option value="">Select</option>
                      {options.interestedIn.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-(--text-secondary)">
                      Age Preference
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-(--text-secondary) uppercase">
                          Min Age: {formData.minPreferredAge}
                        </span>
                        <input
                          type="range"
                          min="18"
                          max="99"
                          name="minPreferredAge"
                          value={formData.minPreferredAge}
                          onChange={handleChange}
                          className="w-full accent-rose-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-(--text-secondary) uppercase">
                          Max Age: {formData.maxPreferredAge}
                        </span>
                        <input
                          type="range"
                          min="18"
                          max="99"
                          name="maxPreferredAge"
                          value={formData.maxPreferredAge}
                          onChange={handleChange}
                          className="w-full accent-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-(--text-secondary)">
                      Preferred Culture
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {options.cultures.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handlePreferredCultureChange(c)}
                          className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border-2 ${
                            formData.preferredCulture.includes(c)
                              ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                              : "bg-(--bg-secondary) border-transparent text-(--text-secondary) hover:border-rose-300"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "about" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-(--text-secondary)">
                      Your Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="input-modern min-h-30 resize-none"
                      placeholder="Tell your story..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-(--text-secondary)">
                      Interests (Separated by comma)
                    </label>
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests.join(", ")}
                      onChange={handleInterestsChange}
                      className="input-modern"
                      placeholder="Hiking, Music, Travel..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-(--text-secondary) flex items-center gap-2">
                        <GraduationCap className="w-3 h-3" /> Education
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="input-modern"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-(--text-secondary) flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Zodiac
                      </label>
                      <select
                        name="zodiac"
                        value={formData.zodiac}
                        onChange={handleChange}
                        className="input-modern"
                      >
                        <option value="">Select</option>
                        {[
                          "Aries",
                          "Taurus",
                          "Gemini",
                          "Cancer",
                          "Leo",
                          "Virgo",
                          "Libra",
                          "Scorpio",
                          "Sagittarius",
                          "Capricorn",
                          "Aquarius",
                          "Pisces",
                        ].map((sign) => (
                          <option key={sign} value={sign}>
                            {sign}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-center font-bold text-sm"
            >
              Success! Profile updated.
            </motion.div>
          )}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-center font-bold text-xs uppercase"
            >
              {errors[0]}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
