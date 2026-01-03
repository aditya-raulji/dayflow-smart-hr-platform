'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminProfilePage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`/api/profile/${session.user.id}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout
                companyName={session?.user?.companyName}
                companyLogo={session?.user?.companyLogo}
            >
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    const user = profile?.user || {};
    const profileData = profile?.profile || {};
    const jobDetails = profile?.jobDetails || {};

    return (
        <DashboardLayout
            companyName={session?.user?.companyName}
            companyLogo={session?.user?.companyLogo}
        >
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600 mt-2">View and manage your HR profile</p>
                    </div>
                    <Link href="/admin/profile/edit">
                        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                            Edit Profile
                        </button>
                    </Link>
                </div>

                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {profileData.profilePicture ? (
                                        <img
                                            src={profileData.profilePicture}
                                            alt={user.name}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        user.name?.charAt(0)?.toUpperCase() || 'U'
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Name</label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {user.name || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {user.email || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {user.phone || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Company</label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {session?.user?.companyName || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

