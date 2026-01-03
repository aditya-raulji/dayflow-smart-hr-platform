'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';

export default function EmployeeAttendancePage() {
    const { data: session } = useSession();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [stats, setStats] = useState({
        daysPresent: 0,
        leavesCount: 0,
        totalWorkingDays: 0,
    });

    useEffect(() => {
        fetchAttendance();
    }, [currentMonth]);

    const fetchAttendance = async () => {
        try {
            const response = await fetch('/api/attendance');
            const data = await response.json();
            setAttendance(data.attendance || []);

            // Calculate stats
            const present = data.attendance?.filter(a => a.status === 'PRESENT').length || 0;
            setStats({
                daysPresent: present,
                leavesCount: 0,
                totalWorkingDays: present,
            });
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const calculateWorkHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return '00:00';
        const diff = new Date(checkOut) - new Date(checkIn);
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-primary-600">Dayflow</h1>
                                {session?.user?.companyName && (
                                    <span className="text-sm text-gray-500">| {session.user.companyName}</span>
                                )}
                            </div>
                            <div className="flex gap-6">
                                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                                    My Profile
                                </Link>
                                <Link href="/dashboard/attendance" className="text-gray-900 font-medium border-b-2 border-primary-600 pb-1">
                                    Attendance
                                </Link>
                                <Link href="/dashboard/time-off" className="text-gray-600 hover:text-gray-900">
                                    Time Off
                                </Link>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/auth/login' })}
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            title="Log Out"
                        >
                            <UserAvatar />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
                    </div>

                    {/* Stats and Controls */}
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-6">
                            {/* Month Navigation */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={goToPreviousMonth}
                                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={goToNextMonth}
                                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    →
                                </button>
                                <div className="px-4 py-2 border border-gray-300 rounded">
                                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Count of days present</p>
                                    <p className="text-2xl font-bold text-primary-600">{stats.daysPresent}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Leaves count</p>
                                    <p className="text-2xl font-bold text-primary-600">{stats.leavesCount}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Total working days</p>
                                    <p className="text-2xl font-bold text-primary-600">{stats.totalWorkingDays}</p>
                                </div>
                            </div>
                        </div>

                        {/* Current Month Display */}
                        <div className="text-center py-4 bg-gray-50 rounded">
                            <p className="text-lg font-medium">{currentMonth.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Check In</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Check Out</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Work Hours</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Extra Hours</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            Loading attendance...
                                        </td>
                                    </tr>
                                ) : attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No attendance records found
                                        </td>
                                    </tr>
                                ) : (
                                    attendance.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatDate(record.date)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatTime(record.checkIn)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatTime(record.checkOut)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{calculateWorkHours(record.checkIn, record.checkOut)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">00:00</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
