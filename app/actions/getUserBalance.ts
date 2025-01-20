'use server'

import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

async function getUserBalance() : Promise<{
    balance?: number;
    error?: string;
}> {
    // get logged in user
    const { userId }: { userId: string | null } = await auth()

    // check for user
    if (!userId) {
        return { error: 'User Not Found' }
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId }
        })

        const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
        return {balance}
    } catch (error) {
        return {error: 'Database error'}
    }
}

export default getUserBalance