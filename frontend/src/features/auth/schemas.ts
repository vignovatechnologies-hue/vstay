import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required").max(72),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
