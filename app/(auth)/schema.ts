import z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  // Basic Registration
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  // Basic Info
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, { message: "Enter a valid phone number" })
    .optional(),

  // Identity
  gender: z.enum(["Male", "Female", "Other"]).optional(),

  // Coerce date string -> Date
  dateOfBirth: z.string().optional(),

  culture: z
    .enum(["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"])
    .optional(),

  // Preferences
  interestedIn: z.enum(["Male", "Female", "Everyone"]).optional(),

  preferredCulture: z
    .array(z.enum(["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"]))
    .optional(),

  // Coerce string -> number safely
  minPreferredAge: z.number().int().positive().optional(),
  maxPreferredAge: z.number().int().positive().optional(),
});

export type SignupData = z.infer<typeof registerSchema>;
