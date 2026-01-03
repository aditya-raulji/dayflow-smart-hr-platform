'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { hrSignupSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SignupForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(hrSignupSchema),
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadLogo = async () => {
        if (!logoFile) return null;

        setUploadingLogo(true);
        const formData = new FormData();
        formData.append('file', logoFile);
        formData.append('type', 'logo');

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                return result.url;
            }
        } catch (error) {
            console.error('Logo upload error:', error);
        } finally {
            setUploadingLogo(false);
        }
        return null;
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            // Upload logo first if selected
            let logoUrl = null;
            if (logoFile) {
                logoUrl = await uploadLogo();
            }

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    companyLogo: logoUrl,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create account');
            }

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                    ✓ Account Created Successfully!
                </h3>
                <p className="text-green-700">
                    Your HR account has been created. Redirecting to login...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {/* Company Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Company Information</h3>

                {/* Company Logo Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                        {logoPreview ? (
                            <div className="w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden bg-white flex items-center justify-center">
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                                id="logo-upload"
                            />
                            <label
                                htmlFor="logo-upload"
                                className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
                            >
                                Choose Logo
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                        </div>
                    </div>
                </div>

                {/* Company Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        {...register('companyName')}
                        placeholder="Enter your company name"
                        error={errors.companyName?.message}
                    />
                </div>
            </div>

            {/* HR User Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">HR Details</h3>
                <div className="space-y-4">
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
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <Input
                            {...register('phone')}
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
                            placeholder="Confirm your password"
                            error={errors.confirmPassword?.message}
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" loading={loading || uploadingLogo} className="w-full">
                {uploadingLogo ? 'Uploading Logo...' : 'Create HR Account'}
            </Button>

            <p className="text-sm text-gray-600 text-center">
                Already have an account?{' '}
                <a href="/auth/login" className="text-primary-600 hover:underline font-medium">
                    Sign in
                </a>
            </p>
        </form>
    );
}
