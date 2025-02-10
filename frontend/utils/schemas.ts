import { z, ZodSchema } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    )
    .min(6, { message: "Username must be at least 6 characters long." })
    .max(30, { message: "Username can’t be longer than 30 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must include at least one number." })
    .regex(/[\W_]/, {
      message:
        "Password must include at least one special character (@, #, $, etc.).",
    })
    .max(25, { message: "password can’t be longer than 30 characters." }),
});

export const loginSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    )
    .min(6, { message: "Username must be at least 6 characters long." })
    .max(30, { message: "Username can’t be longer than 30 characters." }),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
