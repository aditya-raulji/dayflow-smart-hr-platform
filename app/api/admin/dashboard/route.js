import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

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

        // Get total employees count
        const totalEmployees = await prisma.user.count({
            where: {
                companyId: companyId,
                role: 'EMPLOYEE',
            },
        });

        // Get recent employees (last 5)
        const recentEmployees = await prisma.user.findMany({
            where: {
                companyId: companyId,
                role: 'EMPLOYEE',
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
            select: {
                id: true,
                name: true,
                email: true,
                employeeId: true,
                createdAt: true,
            },
        });

        // TODO: Get attendance stats (will be implemented in attendance module)
        const presentToday = 0;
        const onLeave = 0;
        const pendingLeaves = 0;

        return NextResponse.json({
            stats: {
                totalEmployees,
                presentToday,
                onLeave,
                pendingLeaves,
            },
            recentEmployees,
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching dashboard data' },
            { status: 500 }
        );
    }
}

