import { AddEmployeeForm } from '@/components/admin/add-employee-form';
import Link from 'next/link';

export const metadata = {
    title: 'Add New Employee - Dayflow HR',
    description: 'Add a new employee to the system',
};

export default function AddEmployeePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/admin">
                                <h1 className="text-2xl font-bold text-primary-600 cursor-pointer">Dayflow</h1>
                            </Link>
                            <h2 className="text-lg font-medium text-gray-700">Add New Employee</h2>
                        </div>
                        <Link href="/admin">
                            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                                ← Back to Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-8">
                <AddEmployeeForm />
            </main>
        </div>
    );
}
