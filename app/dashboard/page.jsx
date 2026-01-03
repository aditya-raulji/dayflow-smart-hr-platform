'use client';

import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('resume');

    useEffect(() => {
        if (session?.user?.id) {
            fetchEmployeeData();
        }
    }, [session]);

    const fetchEmployeeData = async () => {
        try {
            const response = await fetch(`/api/admin/employees/${session.user.id}`);
            const data = await response.json();
            setEmployee(data.employee);
        } catch (error) {
            console.error('Failed to fetch employee data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Employee data not found.</p>
            </div>
        );
    }

    // Mock data - will be replaced with API calls
    const attendanceSummary = {
        present: 22,
        absent: 2,
        onLeave: 1,
        totalDays: 25,
    };

    const leaveBalance = {
        total: 12,
        used: 3,
        remaining: 9,
        pending: 1,
    };

    const salaryOverview = {
        currentMonth: 50000,
        nextPayDate: '2024-02-01',
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
                        Welcome back, {session?.user?.name}!
                    </h1>
                    <p className="text-gray-600 mt-2">Here's your dashboard overview</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Attendance Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Present</span>
                                    <span className="font-semibold text-green-600">
                                        {attendanceSummary.present} days
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Absent</span>
                                    <span className="font-semibold text-red-600">
                                        {attendanceSummary.absent} days
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">On Leave</span>
                                    <span className="font-semibold text-blue-600">
                                        {attendanceSummary.onLeave} days
                                    </span>
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Days</span>
                                        <span className="font-semibold">
                                            {attendanceSummary.totalDays} days
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leave Balance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Leave Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Leaves</span>
                                    <span className="font-semibold">{leaveBalance.total} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Used</span>
                                    <span className="font-semibold text-orange-600">
                                        {leaveBalance.used} days
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining</span>
                                    <span className="font-semibold text-green-600">
                                        {leaveBalance.remaining} days
                                    </span>
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Pending</span>
                                        <span className="font-semibold text-yellow-600">
                                            {leaveBalance.pending} request
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Salary Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Salary Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-gray-600 text-sm">Current Month</p>
                                    <p className="text-2xl font-bold text-primary-600">
                                        ₹{salaryOverview.currentMonth.toLocaleString()}
                                    </p>
                                </div>
                                <div className="pt-2 border-t">
                                    <p className="text-gray-600 text-sm">Next Pay Date</p>
                                    <p className="font-semibold">
                                        {new Date(salaryOverview.nextPayDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Link href="/leave/apply">
                                    <Button variant="primary" className="w-full">
                                        Apply Leave
                                    </Button>
                                </Link>
                                <Link href="/attendance">
                                    <Button variant="secondary" className="w-full">
                                        View Attendance
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity / Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity & Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        Leave Request Submitted
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Your leave request for 2 days has been submitted and is
                                        pending approval.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Attendance Marked</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        You checked in at 9:15 AM today.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">5 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
