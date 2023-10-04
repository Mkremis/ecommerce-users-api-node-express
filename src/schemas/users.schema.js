import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .max(15, { message: "Username must not exceed 15 characters" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
  title: z
    .string()
    .max(5, { message: "Title must not exceed 5 characters" })
    .optional(),
  first: z
    .string()
    .max(30, { message: "First name must not exceed 30 characters" })
    .optional(),
  last: z
    .string()
    .max(30, { message: "Last name must not exceed 30 characters" })
    .optional(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    })
    .max(50, { message: "Email must not exceed 50 characters" }),
  phone: z
    .string()
    .max(10, { message: "Phone number must not exceed 10 characters" })
    .optional(),
  thumbnail: z.string().optional(),
  city: z
    .string()
    .max(20, { message: "City must not exceed 20 characters" })
    .optional(),
  state: z
    .string()
    .max(20, { message: "State must not exceed 20 characters" })
    .optional(),
  street_number: z
    .string()
    .max(20, { message: "Location number must not exceed 20 characters" })
    .optional(),
  street: z
    .string()
    .max(20, { message: "Street must not exceed 20 characters" })
    .optional(),
  country: z
    .string()
    .max(20, { message: "Country must not exceed 20 characters" })
    .optional(),
  postcode: z
    .string()
    .max(10, { message: "Postcode must not exceed 10 characters" })
    .optional(),
});

export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .max(15, { message: "Username must not exceed 15 characters" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const updateSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .max(15, { message: "Username must not exceed 15 characters" }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .optional(),
  title: z
    .string()
    .max(5, { message: "Title must not exceed 5 characters" })
    .optional(),
  first: z
    .string()
    .max(30, { message: "First name must not exceed 30 characters" })
    .optional(),
  last: z
    .string()
    .max(30, { message: "Last name must not exceed 30 characters" })
    .optional(),
  email: z
    .string()
    .email({
      message: "Email is not valid",
    })
    .max(50, { message: "Email must not exceed 50 characters" })
    .optional(),
  phone: z
    .string()
    .max(10, { message: "Phone number must not exceed 10 characters" })
    .optional(),
  thumbnail: z.string().optional(),
  city: z
    .string()
    .max(20, { message: "City must not exceed 20 characters" })
    .optional(),
  state: z
    .string()
    .max(20, { message: "State must not exceed 20 characters" })
    .optional(),
  street_number: z
    .string()
    .max(20, { message: "Location number must not exceed 20 characters" })
    .optional(),
  street: z
    .string()
    .max(20, { message: "Street must not exceed 20 characters" })
    .optional(),
  country: z
    .string()
    .max(20, { message: "Country must not exceed 20 characters" })
    .optional(),
  postcode: z
    .string()
    .max(10, { message: "Postcode must not exceed 10 characters" })
    .optional(),
});
