"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/auth/whoami");
        const userData = res.data.data;
        setUser(userData);
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth?.slice(0, 10) || "",
          culture: userData.culture || "",
          interestedIn: userData.interestedIn || "",
          preferredCulture: userData.preferredCulture || [],
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
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          data.append(key, value);
        }
      });

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
      <div className="flex h-screen items-center justify-center text-black font-black uppercase">
        Loading your vibe...
      </div>
    );
  }

  const labelStyle =
    "block text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-1";
  const inputStyle =
    "w-full border-b-2 border-gray-100 py-2 text-black bg-transparent focus:border-rose-500 outline-none transition-all font-semibold text-lg";

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 font-sans">
      <div className="max-w-xl mx-auto bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[48px] overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-br from-rose-500 via-rose-400 to-orange-400 p-10 text-white">
          <h2 className="text-4xl font-black italic tracking-tighter">
            Edit Profile
          </h2>
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">
            Dating App Vibes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Error / Success */}
          {(message || errors.length > 0) && (
            <div
              className={`p-4 rounded-3xl border ${message ? "bg-green-50 border-green-100 text-green-600" : "bg-rose-50 border-rose-100 text-rose-600"}`}
            >
              {message && (
                <p className="text-center font-black text-sm">{message}</p>
              )}
              {errors.map((err, i) => (
                <p
                  key={i}
                  className="text-center font-bold text-xs uppercase tracking-tight"
                >
                  ⚠️ {err}
                </p>
              ))}
            </div>
          )}

          {/* Photo Showcase */}
          <section>
            <span className={labelStyle}>Showcase (Max 3)</span>
            <div className="flex flex-row gap-4 mt-4 overflow-x-auto pb-4 no-scrollbar">
              <label className="shrink-0 w-32 h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[28px] flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-all">
                <span className="text-3xl text-gray-300 font-light">+</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {previewPhotos.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  className="shrink-0 w-32 h-48 rounded-[28px] object-cover border-4 border-rose-500 shadow-xl"
                  alt="preview"
                />
              ))}
              {previewPhotos.length === 0 &&
                user?.photos?.map((photo: string, idx: number) => (
                  <img
                    key={idx}
                    src={`/${photo}`}
                    className="shrink-0 w-32 h-48 rounded-[28px] object-cover shadow-sm"
                    alt="saved"
                  />
                ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-2 font-bold text-center italic">
              Optimal: 625px × 1080px
            </p>
          </section>

          {/* Basics */}
          <div className="space-y-6">
            <h3 className="text-black font-black text-xs uppercase border-l-4 border-rose-500 pl-3 tracking-widest">
              The Basics
            </h3>
            <div>
              <label className={labelStyle}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Birthday</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Culture</label>
                <select
                  name="culture"
                  value={formData.culture}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  {[
                    "Brahmin",
                    "Chhetri",
                    "Newar",
                    "Rai",
                    "Magar",
                    "Gurung",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Discovery Filters */}
          <div className="bg-[#FFF5F7] p-8 rounded-[40px] space-y-6">
            <h3 className="text-rose-500 font-black text-xs uppercase tracking-widest">
              Discovery Filters
            </h3>

            {/* Preferred Gender */}
            <div>
              <label className={labelStyle}>Preferred Gender</label>
              <select
                name="interestedIn"
                value={formData.interestedIn}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Everyone">Everyone</option>
              </select>
            </div>

            {/* Preferred Age Range */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Min Preferred Age</label>
                <input
                  type="number"
                  name="minPreferredAge"
                  value={formData.minPreferredAge}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Max Preferred Age</label>
                <input
                  type="number"
                  name="maxPreferredAge"
                  value={formData.maxPreferredAge}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            {/* Preferred Culture (Multiple Choice) */}
            <div>
              <label className={labelStyle}>Preferred Culture</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"].map(
                  (c) => (
                    <label key={c} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.preferredCulture.includes(c)}
                        onChange={() => handlePreferredCultureChange(c)}
                        className="accent-rose-500"
                      />
                      <span className="text-sm font-semibold">{c}</span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* More Details */}
          <div className="space-y-6">
            <h3 className="text-black font-black text-xs uppercase border-l-4 border-rose-500 pl-3 tracking-widest">
              More About You
            </h3>

            <div>
              <label className={labelStyle}>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={inputStyle}
                rows={3}
                placeholder="Tell others about yourself..."
              />
            </div>

            <div>
              <label className={labelStyle}>Interests (comma separated)</label>
              <input
                type="text"
                name="interests"
                value={formData.interests.join(", ")}
                onChange={handleInterestsChange}
                className={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Zodiac</label>
                <select
                  name="zodiac"
                  value={formData.zodiac}
                  onChange={handleChange}
                  className={inputStyle}
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Family Plan</label>
                <select
                  name="familyPlan"
                  value={formData.familyPlan}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="Want children">Want children</option>
                  <option value="Don’t want children">
                    Don’t want children
                  </option>
                  <option value="Open to either">Open to either</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-rose-500 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
