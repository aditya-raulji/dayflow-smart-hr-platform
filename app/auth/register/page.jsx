import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata = {
    title: 'Sign Up - Dayflow HR',
    description: 'Create your Dayflow account',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary-600 mb-2">Dayflow</h1>
                    <p className="text-gray-600 italic">Every workday, perfectly aligned.</p>
                </div>

                {/* Registration Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create HR Account</CardTitle>
                        <CardDescription>
                            Register your company and create your HR account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignupForm />

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href="/auth/login"
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
