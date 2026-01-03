'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SignupForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [verificationUrl, setVerificationUrl] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: 'EMPLOYEE',
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Registration failed');
            }

            setSuccess(result.message);
            if (result.verificationUrl) {
                setVerificationUrl(result.verificationUrl);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">{success}</p>
                </div>
                {verificationUrl && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">
                            <strong>Development Mode:</strong> Click the link below to verify your email:
                        </p>
                        <a
                            href={verificationUrl}
                            className="text-primary-600 hover:text-primary-700 underline break-all"
                        >
                            {verificationUrl}
                        </a>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('employeeId')}
                    placeholder="Enter employee ID"
                    error={errors.employeeId?.message}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('name')}
                    placeholder="Enter your full name"
                    error={errors.name?.message}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                </label>
                <Input
                    {...register('phone')}
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    error={errors.phone?.message}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('password')}
                    type="password"
                    placeholder="Create a strong password"
                    error={errors.password?.message}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Re-enter your password"
                    error={errors.confirmPassword?.message}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('role')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors"
                >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin / HR</option>
                </select>
                {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
            </div>

            <Button type="submit" loading={loading}>
                Create Account
            </Button>
        </form>
    );
}
