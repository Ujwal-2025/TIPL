const { PrismaClient, UserRole } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    const password = 'Admin@12345'
    const hashed = await bcrypt.hash(password, 10)

    // Create or update admin user
    const user = await prisma.user.upsert({
        where: { email: 'admin@tipl.local' },
        update: {
            role: UserRole.ADMIN,
            password: hashed,
            name: 'System Admin',
        },
        create: {
            email: 'admin@tipl.local',
            name: 'System Admin',
            password: hashed,
            role: UserRole.ADMIN,
        },
    })

    // Create or update linked employee profile
    await prisma.employee.upsert({
        where: { sapId: 'SAP-0001' },
        update: {
            userId: user.id,
            status: 'ACTIVE',
        },
        create: {
            sapId: 'SAP-0001',
            name: 'System Admin',
            email: 'admin@tipl.local',
            department: 'Administration',
            position: 'Administrator',
            role: 'ADMIN',
            status: 'ACTIVE',
            userId: user.id,
        },
    })

    console.log('\nSeed complete:')
    console.log('  Email: admin@tipl.local')
    console.log('  Password:', password)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
