import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateVerificationToken, generateTokenExpiry } from '@/lib/auth-utils';
import { signupSchema } from '@/lib/validations/auth';

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = signupSchema.parse(body);

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Check if employee ID already exists
        const existingEmployeeId = await prisma.user.findUnique({
            where: { employeeId: validatedData.employeeId },
        });

        if (existingEmployeeId) {
            return NextResponse.json(
                { error: 'Employee ID already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password);

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationTokenExpiry = generateTokenExpiry();

        // Create user
        const user = await prisma.user.create({
            data: {
                employeeId: validatedData.employeeId,
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                phone: validatedData.phone || null,
                role: validatedData.role,
                verificationToken,
                verificationTokenExpiry,
            },
        });

        // In production, send email with verification link
        // For now, we'll return the token in the response (for development only)
        const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

        console.log('Verification URL:', verificationUrl);

        return NextResponse.json(
            {
                message: 'Registration successful! Please verify your email.',
                verificationUrl, // Remove this in production
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    employeeId: user.employeeId,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
