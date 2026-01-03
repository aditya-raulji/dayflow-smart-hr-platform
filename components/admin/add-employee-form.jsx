'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AddEmployeeForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        nationality: '',
        residingAddress: '',
        jobPosition: '',
        department: '',
        dateOfJoining: '',
        manager: '',
        workLocation: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        panNumber: '',
        uanNumber: '',
        monthlyWage: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(null);

        try {
            const response = await fetch('/api/admin/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    monthlyWage: formData.monthlyWage ? parseFloat(formData.monthlyWage) : undefined,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create employee');
            }

            setSuccess(result.employee);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-green-800 mb-4">
                        ✓ Employee Created Successfully!
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded border border-green-200">
                            <p className="text-sm text-gray-600">Employee ID</p>
                            <p className="text-2xl font-bold text-primary-600">{success.employeeId}</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                            <p className="text-sm text-gray-600">Temporary Password</p>
                            <p className="text-2xl font-bold text-red-600">{success.password}</p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mt-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Important:</strong> Please save these credentials and provide them to the employee.
                                The password cannot be retrieved later.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => router.push('/admin')} className="flex-1">
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => window.location.reload()} variant="secondary" className="flex-1">
                        Add Another Employee
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Personal Information - REQUIRED */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <h3 className="text-lg font-bold mb-1">Personal Information</h3>
                <p className="text-sm text-gray-500 mb-4">* Required fields</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <Input name="firstName" value={formData.firstName} onChange={handleChange} required className={!formData.firstName ? 'border-red-300' : ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input name="lastName" value={formData.lastName} onChange={handleChange} required className={!formData.lastName ? 'border-red-300' : ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} required className={!formData.email ? 'border-red-300' : ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="10 digits" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Date of Birth (Optional)</label>
                        <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Gender (Optional)</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Professional Information - REQUIRED */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <h3 className="text-lg font-bold mb-1">Professional Information</h3>
                <p className="text-sm text-gray-500 mb-4">* Required fields</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Job Position <span className="text-red-500">*</span>
                        </label>
                        <Input name="jobPosition" value={formData.jobPosition} onChange={handleChange} required className={!formData.jobPosition ? 'border-red-300' : ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Department <span className="text-red-500">*</span>
                        </label>
                        <Input name="department" value={formData.department} onChange={handleChange} required className={!formData.department ? 'border-red-300' : ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Date of Joining <span className="text-red-500">*</span>
                        </label>
                        <Input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required className={!formData.dateOfJoining ? 'border-red-300' : ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Manager (Optional)</label>
                        <Input name="manager" value={formData.manager} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Optional Fields */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Additional Information (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Bank Name</label>
                        <Input name="bankName" value={formData.bankName} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Account Number</label>
                        <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">IFSC Code</label>
                        <Input name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">PAN Number</label>
                        <Input name="panNumber" value={formData.panNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Monthly Salary (₹)</label>
                        <Input type="number" name="monthlyWage" value={formData.monthlyWage} onChange={handleChange} placeholder="50000" />
                    </div>
                </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
                Create Employee & Generate Credentials
            </Button>
        </form>
    );
}
