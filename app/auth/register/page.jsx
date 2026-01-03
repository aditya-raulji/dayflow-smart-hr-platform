import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata = {
    title: 'Register - Dayflow HR',
    description: 'Create your HR account',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-primary-600">Dayflow</h1>
                        <p className="text-sm text-gray-500">Human Resource Management System</p>
                    </div>
                    <CardTitle className="text-2xl">Create HR Account</CardTitle>
                    <p className="text-sm text-gray-600">Register your company and start managing employees</p>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    );
}
