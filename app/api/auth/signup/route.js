import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateVerificationToken, generateTokenExpiry } from '@/lib/auth-utils';
import { signupSchema } from '@/lib/validations/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
    try {
        const formData = await request.formData();

        // Extract form data
        const companyName = formData.get('companyName');
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone') || '';
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const companyLogo = formData.get('companyLogo');

        // Validate file if provided
        if (companyLogo && companyLogo.size > 0) {
            // Check file size (5MB max)
            if (companyLogo.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: 'Logo file size must be less than 5MB' },
                    { status: 400 }
                );
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!allowedTypes.includes(companyLogo.type)) {
                return NextResponse.json(
                    { error: 'Logo must be a valid image file (JPEG, PNG, or WebP)' },
                    { status: 400 }
                );
            }
        }

        // Prepare data for validation (without file, as Zod can't validate File objects from FormData)
        const dataForValidation = {
            companyName,
            name,
            email,
            phone: phone || '',
            password,
            confirmPassword,
        };

        // Validate input
        const validatedData = signupSchema.parse(dataForValidation);

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Check if company name already exists
        const existingCompany = await prisma.company.findUnique({
            where: { name: validatedData.companyName },
        });

        if (existingCompany) {
            return NextResponse.json(
                { error: 'Company name already exists' },
                { status: 400 }
            );
        }

        // Handle logo upload
        let logoUrl = null;
        if (companyLogo && companyLogo.size > 0) {
            const bytes = await companyLogo.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create uploads directory if it doesn't exist
            const uploadsDir = join(process.cwd(), 'public', 'uploads', 'logos');
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true });
            }

            // Generate unique filename
            const timestamp = Date.now();
            const fileExtension = companyLogo.name.split('.').pop();
            const filename = `logo_${timestamp}.${fileExtension}`;
            const filepath = join(uploadsDir, filename);

            // Save file
            await writeFile(filepath, buffer);

            // Store relative URL
            logoUrl = `/uploads/logos/${filename}`;
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password);

        // Generate verification token
        const { token, expiry } = generateVerificationToken();

        // Create company first
        const company = await prisma.company.create({
            data: {
                name: validatedData.companyName,
                logo: logoUrl,
            },
        });

        // Create HR user (role is forced to ADMIN)
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                phone: validatedData.phone || null,
                role: 'ADMIN', // Force ADMIN role for HR signup
                companyId: company.id,
                verificationToken,
                verificationTokenExpiry,
            },
        });

            // Create HR user
            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    password: hashedPassword,
                    name: validatedData.name,
                    phone: validatedData.phone,
                    role: 'ADMIN', // HR is ADMIN
                    companyId: company.id,
                    verificationToken: token,
                    verificationTokenExpiry: expiry,
                    emailVerified: true, // Auto-verify HR accounts
                },
            });

            return { company, user };
        });

        // In production, send verification email here
        const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

        return NextResponse.json(
            {
                message: 'HR registration successful! Please verify your email.',
                verificationUrl, // Remove this in production
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    companyName: company.name,
                },
                // For development only - remove in production
                ...(process.env.NODE_ENV === 'development' && {
                    verificationUrl,
                }),
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
            { error: error.message || 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
