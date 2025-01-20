'use server'

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

async function getIncomeExpense(): Promise<{
    income?: number;
    expense?: number;
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
        
        const amounts = transactions.map(transaction => transaction.amount)
        
        const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0)
        const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0)

        return {income, expense}
    } catch (error) {
        return { error: 'Database error'}
    }
}

export default getIncomeExpense