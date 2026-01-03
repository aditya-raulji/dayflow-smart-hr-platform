'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        onLeave: 0,
        pendingLeaves: 0,
    });
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/admin/dashboard');
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setRecentEmployees(data.recentEmployees || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout
            companyName={session?.user?.companyName}
            companyLogo={session?.user?.companyLogo}
        >
            <div className="space-y-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        HR Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your employees and company</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Total Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-primary-600">
                                {loading ? '...' : stats.totalEmployees}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Present Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? '...' : stats.presentToday}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">On Leave</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-600">
                                {loading ? '...' : stats.onLeave}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Pending Leaves</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-orange-600">
                                {loading ? '...' : stats.pendingLeaves}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Employee List Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Recent Employees</CardTitle>
                                <Link
                                    href="/admin/employees"
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p className="text-gray-500">Loading...</p>
                            ) : recentEmployees.length > 0 ? (
                                <div className="space-y-4">
                                    {recentEmployees.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                                                    {employee.name?.charAt(0)?.toUpperCase() || 'E'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {employee.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {employee.employeeId} • {employee.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/admin/employees/${employee.id}`}
                                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                            >
                                                View →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    No employees yet. Add your first employee from the Employees page.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Link href="/admin/employees/new">
                                    <button className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                                        + Add New Employee
                                    </button>
                                </Link>
                                <Link href="/admin/attendance">
                                    <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                        View Attendance
                                    </button>
                                </Link>
                                <Link href="/admin/leave">
                                    <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                        Manage Leaves
                                    </button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
