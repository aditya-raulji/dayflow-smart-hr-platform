# Dayflow - Human Resource Management System

**Tagline:** Every workday, perfectly aligned.

## Overview

Dayflow is a modern Human Resource Management System built with Next.js, featuring a complete authentication and authorization system. This is the foundation module that provides secure user management with role-based access control.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **Validation:** Zod
- **Forms:** React Hook Form
- **Password Hashing:** bcryptjs

## Features

### ✅ Implemented (Authentication Module)

- **User Registration**
  - Employee ID, Name, Email, Phone, Password
  - Role selection (ADMIN/HR or EMPLOYEE)
  - Password security validation (min 8 chars, uppercase, lowercase, number, special char)
  - Duplicate email/employee ID prevention
  - Email verification flow

- **User Login**
  - Email and password authentication
  - JWT-based sessions
  - Email verification check
  - Clear error messages

- **Authorization**
  - Role-based access control (ADMIN vs EMPLOYEE)
  - Protected routes with middleware
  - Automatic redirect based on user role
  - Session management

- **Email Verification**
  - Token-based verification
  - 24-hour token expiry
  - Mock email flow (ready for production email service integration)

### 🔜 Coming Soon

- Employee management (HR features)
- Auto-generated login credentials
- Attendance tracking
- Leave management
- Payroll system

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   cd e:\odoo-27-12\dayflow-smart-hr-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/dayflow_hr?schema=public"

   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-here-change-this-in-production"

   # JWT Secret (generate a random string)
   JWT_SECRET="your-jwt-secret-key-here-change-this-in-production"

   # App Configuration
   NODE_ENV="development"
   ```

   **Generate secure secrets:**
   ```bash
   # For NEXTAUTH_SECRET and JWT_SECRET, use:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Setup the database**
   
   Generate Prisma client:
   ```bash
   npx prisma generate
   ```

   Push the schema to your database:
   ```bash
   npx prisma db push
   ```

   (Optional) Open Prisma Studio to view your database:
   ```bash
   npx prisma studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Sign Up

1. Navigate to `/auth/register`
2. Fill in the registration form:
   - Employee ID (unique identifier)
   - Full Name
   - Email (unique)
   - Phone Number (optional)
   - Password (must meet security requirements)
   - Confirm Password
   - Role (ADMIN or EMPLOYEE)
3. Submit the form
4. Copy the verification URL from the success message
5. Click the verification link to verify your email

### Sign In

1. Navigate to `/auth/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected based on your role:
   - **ADMIN** → `/admin`
   - **EMPLOYEE** → `/dashboard`

### Sign Out

Click the "Sign Out" button in the navigation bar on any dashboard page.

## Project Structure

```
dayflow-smart-hr-platform/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.js          # NextAuth API handler
│   │       ├── signup/
│   │       │   └── route.js          # User registration endpoint
│   │       └── verify-email/
│   │           └── route.js          # Email verification endpoint
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.jsx              # Login page
│   │   ├── register/
│   │   │   └── page.jsx              # Registration page
│   │   └── verify-email/
│   │       └── page.jsx              # Email verification page
│   ├── admin/
│   │   └── page.jsx                  # Admin dashboard (placeholder)
│   ├── dashboard/
│   │   └── page.jsx                  # Employee dashboard (placeholder)
│   ├── layout.jsx                    # Root layout with SessionProvider
│   ├── page.jsx                      # Home page (redirects to login)
│   └── globals.css                   # Global styles
├── components/
│   ├── auth/
│   │   ├── login-form.jsx            # Login form component
│   │   └── signup-form.jsx           # Registration form component
│   └── ui/
│       ├── button.jsx                # Button component
│       ├── card.jsx                  # Card components
│       └── input.jsx                 # Input component
├── lib/
│   ├── validations/
│   │   └── auth.js                   # Zod validation schemas
│   ├── auth-utils.js                 # Password hashing & token utilities
│   └── db.js                         # Prisma client singleton
├── prisma/
│   └── schema.prisma                 # Database schema
├── middleware.js                     # Route protection & role-based access
├── .env.example                      # Environment variables template
├── jsconfig.json                     # JavaScript configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
└── package.json                      # Dependencies
```

## Database Schema

### User Model

```prisma
model User {
  id                      String    @id @default(cuid())
  employeeId              String    @unique
  email                   String    @unique
  password                String
  name                    String
  phone                   String?
  role                    Role      @default(EMPLOYEE)
  emailVerified           Boolean   @default(false)
  verificationToken       String?
  verificationTokenExpiry DateTime?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}

enum Role {
  ADMIN
  EMPLOYEE
}
```

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT-based session management
- ✅ Email verification before login
- ✅ Password strength validation
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ Secure token generation for email verification

## Development Notes

- **Email Verification:** Currently using a mock email system. The verification URL is returned in the API response for development. In production, integrate with an email service like Resend, SendGrid, or Nodemailer.
- **Auto-generated Login IDs:** This feature will be implemented in the employee management module when HR can add new employees.

## Contributing

This is the base authentication module. Future modules will build upon this foundation.

## License

Proprietary - Dayflow HR Management System
