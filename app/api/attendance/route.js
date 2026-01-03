import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

// POST check in/out
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { action } = await request.json(); // 'checkin' or 'checkout'

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's attendance record
        let attendance = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                date: {
                    gte: today,
                },
            },
        });

        if (action === 'checkin') {
            if (attendance && attendance.checkIn) {
                return NextResponse.json(
                    { error: 'Already checked in today' },
                    { status: 400 }
                );
            }

            if (!attendance) {
                attendance = await prisma.attendance.create({
                    data: {
                        userId: session.user.id,
                        checkIn: new Date(),
                        status: 'PRESENT',
                    },
                });
            } else {
                attendance = await prisma.attendance.update({
                    where: { id: attendance.id },
                    data: {
                        checkIn: new Date(),
                        status: 'PRESENT',
                    },
                });
            }

            return NextResponse.json(
                {
                    message: 'Checked in successfully',
                    attendance,
                },
                { status: 200 }
            );
        } else if (action === 'checkout') {
            if (!attendance || !attendance.checkIn) {
                return NextResponse.json(
                    { error: 'Please check in first' },
                    { status: 400 }
                );
            }

            if (attendance.checkOut) {
                return NextResponse.json(
                    { error: 'Already checked out today' },
                    { status: 400 }
                );
            }

            attendance = await prisma.attendance.update({
                where: { id: attendance.id },
                data: {
                    checkOut: new Date(),
                },
            });

            return NextResponse.json(
                {
                    message: 'Checked out successfully',
                    attendance,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Attendance error:', error);
        return NextResponse.json(
            { error: 'Failed to process attendance' },
            { status: 500 }
        );
    }
}

// GET attendance records
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || session.user.id;

        // Only admin can view other users' attendance
        if (userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const attendance = await prisma.attendance.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 30,
        });

        return NextResponse.json({ attendance }, { status: 200 });
    } catch (error) {
        console.error('Get attendance error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch attendance' },
            { status: 500 }
        );
    }
}
