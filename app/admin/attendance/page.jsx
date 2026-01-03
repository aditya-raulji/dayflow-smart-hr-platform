'use client';

import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminAttendancePage() {
    const { data: session } = useSession();

    return (
        <DashboardLayout
            companyName={session?.user?.companyName}
            companyLogo={session?.user?.companyLogo}
        >
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Module</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Attendance management module will be implemented here.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

