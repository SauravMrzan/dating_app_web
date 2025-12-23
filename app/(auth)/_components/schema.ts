import z, { check } from "zod";

export const loginSchema = z.object({
    email: z.email({message: "Enter valid email."}),
    password: z.string().min(6,{message: "Password must be atleast 6 characters"}),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(6,{message:"Enter your name"}),
    email: z.email({message:"Enter valid email"}),
    password:z.string().min(6,{message:"Password must be atleast 6 characters"}),
    confirmPassword: z.string().min(6,{message:"Password must be atleast 6 characters"})
}).refine((check) => check.password == check.confirmPassword,{
    path:["confirmPassword"],
    message:"Passwords doesn't match",
});

export type RegisterData = z.infer<typeof registerSchema>;