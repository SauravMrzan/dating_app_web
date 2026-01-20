import z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    // Basic Registration
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().optional(),

    // Basic Info
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z.string().optional(),

    // Identity
    gender: z.enum(["Male", "Female", "Other"]).optional(),

    // Coerce date string -> Date
    dateOfBirth: z.coerce.date().optional(),

    culture: z
      .enum(["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"])
      .optional(),

    // Preferences
    interestedIn: z.enum(["Male", "Female", "Everyone"]).optional(),

    preferredCulture: z
      .array(z.enum(["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"]))
      .optional(),

    // Coerce string -> number safely
    minPreferredAge: z.coerce.number().int().positive().optional(),
    maxPreferredAge: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...rest }) => rest); // remove confirmPassword

export type RegisterData = z.infer<typeof registerSchema>;
