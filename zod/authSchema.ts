import { z } from "zod";

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password is required",
  })
  .min(7, "Password must be at least 7 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );
