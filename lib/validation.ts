// import { z } from "zod";

// const name = z.string().min(2, "Name cannot be empty.");
// const password = z
//   .string()
//   .min(8, "Password must be at least 8 characters long.");
// const email = z.string().email("Please provide a valid email address.");
// const otp = z.string().length(6, "OTP must be exactly 6 digits.");
// const otpType = z.enum(["email-verification", "forget-password"]);

// const signInSchema = z.object({
//   email: email,
//   password: password,
// });

// const resetPasswordSchema = z.object({
//   otp: otp,
//   password: password,
//   confirmPassword: password,
// });

// const signUpSchema = z.object({
//   name: name,
//   email: email,
//   password: password,
// });

// const userRole = z.enum(["admin", "user", "farmer"]);

// export type SignInSchema = z.infer<typeof signInSchema>;
// export type SignUpSchema = z.infer<typeof signUpSchema>;
// export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
// export type OTP = z.infer<typeof otp>;
// export type Email = z.infer<typeof email>;
// export type Password = z.infer<typeof password>;
// export type OTPType = z.infer<typeof otpType>;
// export type Name = z.infer<typeof name>;
// export type UserRole = z.infer<typeof userRole>;

// export {
//   otp,
//   name,
//   email,
//   otpType,
//   userRole,
//   password,
//   signInSchema,
//   signUpSchema,
//   resetPasswordSchema,
// };

import z from "zod";

export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });
