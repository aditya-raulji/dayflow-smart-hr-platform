'use client';

import { useState, useEffect } from 'react';
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
    const [logoPreview, setLogoPreview] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const logoFile = watch('companyLogo');

    // Handle logo preview
    useEffect(() => {
        if (logoFile && logoFile.length > 0) {
            const file = logoFile[0];
            if (file instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setLogoPreview('');
        }
    }, [logoFile]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('companyName', data.companyName);
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('phone', data.phone || '');
            formData.append('password', data.password);
            formData.append('confirmPassword', data.confirmPassword);
            
            if (data.companyLogo && data.companyLogo.length > 0) {
                formData.append('companyLogo', data.companyLogo[0]);
            }

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: formData,
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
                    Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('companyName')}
                    placeholder="Enter company name"
                    error={errors.companyName?.message}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                </label>
                <input
                    {...register('companyLogo')}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {errors.companyLogo && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyLogo.message}</p>
                )}
                {logoPreview && (
                    <div className="mt-2">
                        <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="h-20 w-20 object-contain border border-gray-300 rounded-lg"
                        />
                    </div>
                )}
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

            <Button type="submit" loading={loading}>
                Create HR Account
            </Button>
        </form>
    );
}
