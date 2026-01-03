'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddEmployeePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [credentials, setCredentials] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess(false);
        setCredentials(null);

        try {
            // Split name into first and last name
            const nameParts = data.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

            if (!firstName || !lastName) {
                setError('Please provide both first and last name');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/admin/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: data.email,
                    phone: data.phone || '',
                    jobPosition: data.jobPosition || '',
                    department: data.department || '',
                    manager: data.manager || '',
                    workLocation: data.workLocation || '',
                    dateOfJoining: data.dateOfJoining || new Date().toISOString().split('T')[0],
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create employee');
            }

            setSuccess(true);
            setCredentials(result.credentials);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success && credentials) {
        return (
            <DashboardLayout
                companyName={session?.user?.companyName}
                companyLogo={session?.user?.companyLogo}
            >
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-800">
                                Employee Created Successfully!
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-green-700">
                                    The employee has been added to your system. Please share these
                                    login credentials with them:
                                </p>
                                <div className="bg-white p-6 rounded-lg border-2 border-green-300 space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Login ID:
                                        </label>
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            {credentials.loginId}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Email:
                                        </label>
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            {credentials.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Password:
                                        </label>
                                        <p className="text-lg font-bold text-gray-900 mt-1 font-mono">
                                            {credentials.password}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => {
                                            setSuccess(false);
                                            setCredentials(null);
                                        }}
                                        variant="secondary"
                                    >
                                        Add Another Employee
                                    </Button>
                                    <Button
                                        onClick={() => router.push('/admin/employees')}
                                        variant="primary"
                                    >
                                        View All Employees
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            companyName={session?.user?.companyName}
            companyLogo={session?.user?.companyLogo}
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
                    <p className="text-gray-600 mt-2">
                        Fill in the details below. Login ID and password will be automatically
                        generated.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        {...register('name', {
                                            required: 'Full name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters',
                                            },
                                        })}
                                        placeholder="John Doe"
                                        error={errors.name?.message}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        First and last name required for Login ID generation
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        error={errors.email?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <Input
                                        {...register('phone', {
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Phone must be 10 digits',
                                            },
                                        })}
                                        type="tel"
                                        placeholder="1234567890"
                                        error={errors.phone?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Joining
                                    </label>
                                    <Input
                                        {...register('dateOfJoining')}
                                        type="date"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Position
                                    </label>
                                    <Input
                                        {...register('jobPosition')}
                                        placeholder="Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department
                                    </label>
                                    <Input
                                        {...register('department')}
                                        placeholder="Engineering"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Manager
                                    </label>
                                    <Input
                                        {...register('manager')}
                                        placeholder="Manager Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Work Location
                                    </label>
                                    <Input
                                        {...register('workLocation')}
                                        placeholder="Office Location"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" loading={loading} variant="primary">
                                    Create Employee
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => router.back()}
                                    variant="secondary"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

