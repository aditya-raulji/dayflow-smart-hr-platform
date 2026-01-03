'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';

export default function EmployeeDashboard() {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Navigation */}
            <nav className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">D</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                        Dayflow
                                    </h1>
                                    {session?.user?.companyName && (
                                        <p className="text-xs text-gray-500">{session.user.companyName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    Employees
                                </Link>
                                <Link href="/dashboard/attendance" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    Attendance
                                </Link>
                                <Link href="/dashboard/time-off" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    Time Off
                                </Link>
                            </div>
                        </div>

                        {/* User Avatar Dropdown */}
                        <UserAvatar />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                    </div>

                    {/* Profile Section */}
                    <div className="p-8 border-b">
                        <div className="flex items-start gap-8">
                            {/* Profile Picture */}
                            <div className="relative flex-shrink-0">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center overflow-hidden shadow-lg">
                                    {employee.profile?.profilePicture ? (
                                        <img src={employee.profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-16 h-16 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <button className="absolute bottom-2 right-2 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 shadow-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Employee Info - 2 Columns */}
                            <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-4">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">My Name</h3>
                                        <p className="text-sm text-gray-600">{employee.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Login ID</label>
                                        <p className="text-gray-900">{employee.employeeId}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="text-gray-900">{employee.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Mobile</label>
                                        <p className="text-gray-900">{employee.phone || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Company</label>
                                        <p className="text-gray-900">{session?.user?.companyName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Department</label>
                                        <p className="text-gray-900">{employee.jobDetails?.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Manager</label>
                                        <p className="text-gray-900">{employee.jobDetails?.manager || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Location</label>
                                        <p className="text-gray-900">{employee.jobDetails?.workLocation || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b">
                        <div className="flex gap-0 px-8">
                            <button
                                onClick={() => setActiveTab('resume')}
                                className={`px-6 py-3 border-b-2 font-medium transition-colors ${activeTab === 'resume'
                                        ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Resume
                            </button>
                            <button
                                onClick={() => setActiveTab('private')}
                                className={`px-6 py-3 border-b-2 font-medium transition-colors ${activeTab === 'private'
                                        ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Private Info
                            </button>
                            {/* NO SALARY TAB FOR EMPLOYEES */}
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`px-6 py-3 border-b-2 font-medium transition-colors ${activeTab === 'security'
                                        ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Security
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {/* Resume Tab */}
                        {activeTab === 'resume' && (
                            <div className="space-y-6">
                                <p className="text-sm text-gray-600">Resume information coming soon...</p>
                            </div>
                        )}

                        {/* Private Info Tab */}
                        {activeTab === 'private' && (
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.dateOfBirth ? new Date(employee.profile.dateOfBirth).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Residing Address</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.residingAddress || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Nationality</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.nationality || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Personal Email</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.personalEmail || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Gender</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.gender || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Marital Status</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.maritalStatus || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date of Joining</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.jobDetails?.dateOfJoining ? new Date(employee.jobDetails.dateOfJoining).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column - Bank Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Bank Details</h3>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Account Number</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.accountNumber || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.bankName || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.ifscCode || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">PAN No</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.panNumber || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">UAN NO</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.profile?.uanNumber || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Emp Code</label>
                                        <p className="mt-1 text-gray-900 border-b border-gray-300 pb-2">
                                            {employee.employeeId || ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <p className="text-sm text-gray-600">Security settings coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
