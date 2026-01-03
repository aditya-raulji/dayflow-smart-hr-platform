import { z } from 'zod';

// Password validation schema
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Sign up validation schema
export const signupSchema = z.object({
    employeeId: z
        .string()
        .min(3, 'Employee ID must be at least 3 characters')
        .max(20, 'Employee ID must not exceed 20 characters'),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase(),
    phone: z
        .string()
        .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .optional()
        .or(z.literal('')),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(['ADMIN', 'EMPLOYEE'], {
        errorMap: () => ({ message: 'Role must be either ADMIN or EMPLOYEE' }),
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase(),
    password: z
        .string()
        .min(1, 'Password is required'),
});
