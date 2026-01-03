'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';
import { AttendanceStatusDot } from '@/components/ui/attendance-status-dot';
import { SalaryCalculator } from '@/components/admin/salary-calculator';

export default function EmployeeDetailPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('resume');

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            if (resolvedParams.id) {
                fetchEmployee(resolvedParams.id);
            }
        };
        fetchData();
    }, [params]);

    const fetchEmployee = async (id) => {
        try {
            const response = await fetch(`/api/admin/employees/${id}`);
            const data = await response.json();
            setEmployee(data.employee);
        } catch (error) {
            console.error('Failed to fetch employee:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading employee details...</p>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Employee not found.</p>
            </div>
        );
    }

    const isAdmin = session?.user?.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Navigation */}
            <nav className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/admin" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">D</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                        Dayflow
                                    </h1>
                                </div>
                            </Link>

                            <div className="flex gap-1">
                                <Link href="/admin" className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg">
                                    Employees
                                </Link>
                                <Link href="/admin/attendance" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    Attendance
                                </Link>
                                <Link href="/admin/time-off" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
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
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Employees
                </button>

                <div className="bg-white rounded-lg shadow-lg">
                    {/* Profile Header */}
                    <div className="p-8 border-b">
                        <div className="flex items-start gap-6">
                            {/* Left Side - Profile Picture */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center overflow-hidden shadow-lg">
                                    {employee.profile?.profilePicture ? (
                                        <img src={employee.profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-12 h-12 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 shadow-lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Middle - Employee Info */}
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h2>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium">Login ID:</span>
                                        <span>{employee.employeeId}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium">Email:</span>
                                        <span>{employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium">Department:</span>
                                        <span>{employee.jobDetails?.department || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium">Manager:</span>
                                        <span>{employee.jobDetails?.manager || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Status Dot */}
                            <div className="flex items-start">
                                <AttendanceStatusDot status="present" size="lg" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b">
                        <div className="flex gap-0 px-8">
                            <button
                                onClick={() => setActiveTab('resume')}
                                className={`px-6 py-3 border-b-2 font-medium transition-colors ${activeTab === 'resume'
                                    ? 'border-primary-600 text-primary-600 bg-primary-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Resume
                            </button>
                            <button
                                onClick={() => setActiveTab('private')}
                                className={`px-6 py-3 border-b-2 font-medium transition-colors ${activeTab === 'private'
                                    ? 'border-primary-600 text-primary-600 bg-primary-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Private Info
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => setActiveTab('salary')}
                                    className={`px-6 py-3 border-b-2 font-medium transition-colors ${activeTab === 'salary'
                                        ? 'border-primary-600 text-primary-600 bg-primary-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    Salary Info
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {/* Resume Tab */}
                        {activeTab === 'resume' && (
                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Column - About & Skills */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">About 📝</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                {employee.profile?.about || 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">What I love about my job 🎯</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                {employee.profile?.jobLoves || 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">My interests and hobbies 🎨</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                {employee.profile?.interestsHobbies || 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Skills & Certifications */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                                + add skills
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Certifications</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                                + add skills
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Private Info Tab */}
                        {activeTab === 'private' && (
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                    <p className="mt-1 text-gray-900">
                                        {employee.profile?.dateOfBirth ? new Date(employee.profile.dateOfBirth).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Gender</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.gender || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Marital Status</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.maritalStatus || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Nationality</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.nationality || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Residing Address</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.residingAddress || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.bankName || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Account Number</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.accountNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.ifscCode || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">PAN Number</label>
                                    <p className="mt-1 text-gray-900">{employee.profile?.panNumber || 'N/A'}</p>
                                </div>
                            </div>
                        )}

                        {/* Salary Info Tab - ADMIN ONLY */}
                        {activeTab === 'salary' && isAdmin && (
                            <SalaryCalculator
                                employeeId={employee.id}
                                initialSalary={employee.salaryStructure}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
