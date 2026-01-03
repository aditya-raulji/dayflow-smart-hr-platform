'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else if (result?.ok) {
                // Redirect will be handled by middleware based on role
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID / Email <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('email')}
                    type="text"
                    placeholder="Enter your Employee ID or Email"
                    error={errors.email?.message}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Example: OIJODO20220001
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('password')}
                    type="password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                />
            </div>

            <Button type="submit" loading={loading}>
                Sign In
            </Button>

            <p className="text-sm text-gray-600 text-center">
                Don't have an account?{' '}
                <a href="/auth/register" className="text-primary-600 hover:underline">
                    Register as HR
                </a>
            </p>
        </form>
    );
}
