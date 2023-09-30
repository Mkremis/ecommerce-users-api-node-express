import { z } from "zod";

export const registerSchema = z.object({
  login_username: z
    .string({
      required_error: "Username is required",
    })
    .max(15, { message: "Username must not exceed 15 characters" }),
  login_password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
  fullname_title: z
    .string()
    .max(5, { message: "Title must not exceed 5 characters" })
    .optional(),
  fullname_first: z
    .string()
    .max(30, { message: "First name must not exceed 30 characters" })
    .optional(),
  fullname_last: z
    .string()
    .max(30, { message: "Last name must not exceed 30 characters" })
    .optional(),
  contact_email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    })
    .max(50, { message: "Email must not exceed 50 characters" }),
  contact_phone: z
    .string()
    .max(10, { message: "Phone number must not exceed 10 characters" })
    .optional(),
  picture_thumbnail: z.string().optional(),
  location_city: z
    .string()
    .max(20, { message: "City must not exceed 20 characters" })
    .optional(),
  location_state: z
    .string()
    .max(20, { message: "State must not exceed 20 characters" })
    .optional(),
  location_number: z
    .string()
    .max(20, { message: "Location number must not exceed 20 characters" })
    .optional(),
  location_street: z
    .string()
    .max(20, { message: "Street must not exceed 20 characters" })
    .optional(),
  location_country: z
    .string()
    .max(20, { message: "Country must not exceed 20 characters" })
    .optional(),
  location_postcode: z
    .string()
    .max(10, { message: "Postcode must not exceed 10 characters" })
    .optional(),
});

export const loginSchema = z.object({
  login_username: z
    .string({
      required_error: "Username is required",
    })
    .max(15, { message: "Username must not exceed 15 characters" }),
  login_password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const updateSchema = z.object({
  login_username: z
    .string({
      required_error: "Username is required",
    })
    .max(15, { message: "Username must not exceed 15 characters" }),
  login_password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .optional(),
  fullname_title: z
    .string()
    .max(5, { message: "Title must not exceed 5 characters" })
    .optional(),
  fullname_first: z
    .string()
    .max(30, { message: "First name must not exceed 30 characters" })
    .optional(),
  fullname_last: z
    .string()
    .max(30, { message: "Last name must not exceed 30 characters" })
    .optional(),
  contact_email: z
    .string()
    .email({
      message: "Email is not valid",
    })
    .max(50, { message: "Email must not exceed 50 characters" })
    .optional(),
  contact_phone: z
    .string()
    .max(10, { message: "Phone number must not exceed 10 characters" })
    .optional(),
  picture_thumbnail: z.string().optional(),
  location_city: z
    .string()
    .max(20, { message: "City must not exceed 20 characters" })
    .optional(),
  location_state: z
    .string()
    .max(20, { message: "State must not exceed 20 characters" })
    .optional(),
  location_number: z
    .string()
    .max(20, { message: "Location number must not exceed 20 characters" })
    .optional(),
  location_street: z
    .string()
    .max(20, { message: "Street must not exceed 20 characters" })
    .optional(),
  location_country: z
    .string()
    .max(20, { message: "Country must not exceed 20 characters" })
    .optional(),
  location_postcode: z
    .string()
    .max(10, { message: "Postcode must not exceed 10 characters" })
    .optional(),
});
