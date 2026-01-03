'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-primary-600">Dayflow</h1>
                            <p className="text-xs text-gray-500">Employee Dashboard</p>
                        </div>
                        <Button onClick={() => signOut({ callbackUrl: '/auth/login' })} variant="secondary">
                            Sign Out
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {session?.user?.name}!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Employee ID</p>
                                <p className="font-medium">{session?.user?.employeeId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{session?.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Role</p>
                                <p className="font-medium">{session?.user?.role}</p>
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 text-sm">
                                    <strong>Note:</strong> This is a placeholder dashboard. Employee features will be added in future modules.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
