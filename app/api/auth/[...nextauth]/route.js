import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth-utils';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email and password are required');
                    }

                    // Find user by email
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email.toLowerCase() },
                    });

                    if (!user) {
                        throw new Error('Invalid email or password');
                    }

                    // Check if email is verified
                    if (!user.emailVerified) {
                        throw new Error('Please verify your email before logging in');
                    }

                    // Verify password
                    const isValidPassword = await verifyPassword(
                        credentials.password,
                        user.password
                    );

                    if (!isValidPassword) {
                        throw new Error('Invalid email or password');
                    }

                    // Get company info
                    const company = user.companyId
                        ? await prisma.company.findUnique({
                              where: { id: user.companyId },
                          })
                        : null;

                    // Return user object (password excluded)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        employeeId: user.employeeId,
                        companyId: user.companyId,
                        companyName: company?.name,
                        companyLogo: company?.logo,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.employeeId = user.employeeId;
                token.companyId = user.companyId;
                token.companyName = user.companyName;
                token.companyLogo = user.companyLogo;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.employeeId = token.employeeId;
                session.user.companyId = token.companyId;
                session.user.companyName = token.companyName;
                session.user.companyLogo = token.companyLogo;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth v5 beta - destructure handlers from NextAuth
const { handlers } = NextAuth(authOptions);

// Export handlers for Next.js App Router
export const { GET, POST } = handlers;
