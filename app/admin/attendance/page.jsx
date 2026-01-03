'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';

export default function AdminAttendancePage() {
    const { data: session } = useSession();
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('day'); // 'day' or 'date'

    useEffect(() => {
        fetchEmployeesAttendance();
    }, [selectedDate]);

    const fetchEmployeesAttendance = async () => {
        try {
            const response = await fetch('/api/admin/employees');
            const data = await response.json();
            setEmployees(data.employees || []);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
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

    const filteredEmployees = employees.filter((emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold text-primary-600">Dayflow</h1>
                            <div className="flex gap-6">
                                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                                    Employees
                                </Link>
                                <Link href="/admin/attendance" className="text-gray-900 font-medium border-b-2 border-primary-600 pb-1">
                                    Attendance
                                </Link>
                                <Link href="/admin/time-off" className="text-gray-600 hover:text-gray-900">
                                    Time Off
                                </Link>
                            </div>
                        </div>
                        <UserAvatar />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
                        <p className="text-sm text-gray-600 mt-1">Attendances List View - For Admin/HR Officer</p>
                    </div>

                    {/* Controls */}
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            {/* Search */}
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search by name or employee ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* View Mode and Date */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setViewMode('date')}
                                    className={`px-4 py-2 rounded ${viewMode === 'date' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                                >
                                    Date ▼
                                </button>
                                <button
                                    onClick={() => setViewMode('day')}
                                    className={`px-4 py-2 rounded ${viewMode === 'day' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                                >
                                    Day
                                </button>
                            </div>
                        </div>

                        {/* Current Date Display */}
                        <div className="text-center py-4 bg-gray-50 rounded">
                            <p className="text-lg font-medium">{new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Emp</th>
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
                                ) : filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No employees found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((employee) => {
                                        // Get today's attendance for this employee
                                        const todayAttendance = null; // You can fetch this from API

                                        return (
                                            <tr key={employee.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                                        <p className="text-xs text-gray-500">{employee.employeeId}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {todayAttendance ? formatTime(todayAttendance.checkIn) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {todayAttendance ? formatTime(todayAttendance.checkOut) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {todayAttendance ? calculateWorkHours(todayAttendance.checkIn, todayAttendance.checkOut) : '00:00'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">00:00</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
