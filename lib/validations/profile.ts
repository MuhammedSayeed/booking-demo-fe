import { z } from "zod";

// Profile form validation schema
export const profileFormSchema = z.object({
    first_name: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "First name can only contain letters and spaces"),
    last_name: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "Last name can only contain letters and spaces"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
        .optional()
        .or(z.literal("")),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address must be less than 200 characters")
        .optional()
        .or(z.literal("")),
    passport_number: z
        .string()
        .min(5, "Passport number must be at least 5 characters")
        .max(20, "Passport number must be less than 20 characters")
        .optional()
        .or(z.literal("")),
    date_of_birth: z
        .string()
        .refine((date) => !date || !isNaN(Date.parse(date)), "Invalid date format")
        .refine(
            (date) => {
                if (!date) return true;
                const birthDate = new Date(date);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 18 && age <= 120;
            },
            "You must be between 18 and 120 years old"
        )
        .optional()
        .or(z.literal("")),
});

// Password form validation schema
export const passwordFormSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be less than 100 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

// Type exports for TypeScript
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type PasswordFormValues = z.infer<typeof passwordFormSchema>; 