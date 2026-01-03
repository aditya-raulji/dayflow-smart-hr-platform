import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth-utils';
import { generateLoginId, generateRandomPassword } from '@/lib/employee-utils';
import { z } from 'zod';

const createEmployeeSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address').toLowerCase(),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits').optional().or(z.literal('')),
    jobPosition: z.string().optional(),
    department: z.string().optional(),
    manager: z.string().optional(),
    workLocation: z.string().optional(),
    dateOfJoining: z.string().optional(),
});

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyId = session.user.companyId;

        if (!companyId) {
            return NextResponse.json(
                { error: 'Company not found' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const validatedData = createEmployeeSchema.parse(body);

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

        // Generate Login ID
        const employeeId = await generateLoginId(
            validatedData.firstName,
            validatedData.lastName,
            companyId
        );

        // Check if generated Login ID already exists (shouldn't happen, but safety check)
        const existingEmployeeId = await prisma.user.findUnique({
            where: { employeeId: employeeId },
        });

        if (existingEmployeeId) {
            return NextResponse.json(
                { error: 'Login ID conflict. Please try again.' },
                { status: 500 }
            );
        }

        // Generate random password
        const randomPassword = generateRandomPassword(12);

        // Hash password
        const hashedPassword = await hashPassword(randomPassword);

        // Create user with employee role
        const user = await prisma.user.create({
            data: {
                employeeId: employeeId,
                email: validatedData.email,
                password: hashedPassword,
                name: `${validatedData.firstName} ${validatedData.lastName}`,
                phone: validatedData.phone || null,
                role: 'EMPLOYEE',
                companyId: companyId,
                emailVerified: true, // Auto-verify for HR-created employees
            },
        });

        // Create job details if provided
        if (validatedData.jobPosition || validatedData.department || validatedData.manager || validatedData.workLocation) {
            await prisma.jobDetails.create({
                data: {
                    userId: user.id,
                    jobPosition: validatedData.jobPosition || null,
                    department: validatedData.department || null,
                    manager: validatedData.manager || null,
                    workLocation: validatedData.workLocation || null,
                    dateOfJoining: validatedData.dateOfJoining
                        ? new Date(validatedData.dateOfJoining)
                        : new Date(),
                },
            });
        }

        // Create empty profile
        await prisma.employeeProfile.create({
            data: {
                userId: user.id,
            },
        });

        return NextResponse.json(
            {
                message: 'Employee created successfully',
                employee: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    employeeId: user.employeeId,
                },
                credentials: {
                    loginId: employeeId,
                    password: randomPassword,
                    email: validatedData.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create employee error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'An error occurred while creating employee' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companyId = session.user.companyId;

        if (!companyId) {
            return NextResponse.json(
                { error: 'Company not found' },
                { status: 400 }
            );
        }

        const employees = await prisma.user.findMany({
            where: {
                companyId: companyId,
                role: 'EMPLOYEE',
            },
            include: {
                jobDetails: true,
                profile: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ employees });
    } catch (error) {
        console.error('Get employees error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching employees' },
            { status: 500 }
        );
    }
}

