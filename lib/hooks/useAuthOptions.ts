"use client";

import { useEffect, useState } from "react";
import { getAuthOptions } from "@/lib/api/auth";

type AuthOptions = {
  cultures: string[];
  genders: string[];
  interestedIn: string[];
};

const DEFAULT_OPTIONS: AuthOptions = {
  cultures: [],
  genders: ["Male", "Female", "Other"],
  interestedIn: ["Male", "Female", "Everyone"],
};

export const useAuthOptions = () => {
  const [options, setOptions] = useState<AuthOptions>(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchOptions = async () => {
      try {
        const result = await getAuthOptions();
        const data = result?.data;

        if (active && data) {
          setOptions({
            cultures: Array.isArray(data.cultures) ? data.cultures : [],
            genders: Array.isArray(data.genders)
              ? data.genders
              : DEFAULT_OPTIONS.genders,
            interestedIn: Array.isArray(data.interestedIn)
              ? data.interestedIn
              : DEFAULT_OPTIONS.interestedIn,
          });
        }
      } catch {
        if (active) {
          setOptions(DEFAULT_OPTIONS);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOptions();

    return () => {
      active = false;
    };
  }, []);

  return { options, loading };
};
