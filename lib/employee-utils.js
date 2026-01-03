import { prisma } from '@/lib/db';

/**
 * Generate Login ID in format: OI[First2LettersOfFirstName][First2LettersOfLastName][Year][SerialNumber]
 * Example: OIJODO20220001
 * 
 * @param {string} firstName - Employee's first name
 * @param {string} lastName - Employee's last name
 * @param {string} companyId - Company ID to ensure uniqueness within company
 * @returns {Promise<string>} Generated Login ID
 */
export async function generateLoginId(firstName, lastName, companyId) {
    // Get first 2 letters of first name (uppercase)
    const firstInitials = firstName.substring(0, 2).toUpperCase();
    
    // Get first 2 letters of last name (uppercase)
    const lastInitials = lastName.substring(0, 2).toUpperCase();
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Find the highest serial number for this year and company
    const existingEmployees = await prisma.user.findMany({
        where: {
            companyId: companyId,
            employeeId: {
                startsWith: `OI${firstInitials}${lastInitials}${currentYear}`,
            },
        },
        orderBy: {
            employeeId: 'desc',
        },
        take: 1,
    });
    
    let serialNumber = 1;
    if (existingEmployees.length > 0 && existingEmployees[0].employeeId) {
        // Extract serial number from existing employee ID
        const lastId = existingEmployees[0].employeeId;
        const serialPart = lastId.substring(lastId.length - 4);
        serialNumber = parseInt(serialPart, 10) + 1;
    }
    
    // Format serial number with leading zeros (4 digits)
    const serialString = serialNumber.toString().padStart(4, '0');
    
    // Construct Login ID: OI + initials + year + serial
    const loginId = `OI${firstInitials}${lastInitials}${currentYear}${serialString}`;
    
    return loginId;
}

/**
 * Generate a random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} Random password
 */
export function generateRandomPassword(length = 12) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + special;
    
    let password = '';
    
    // Ensure at least one character from each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
}

