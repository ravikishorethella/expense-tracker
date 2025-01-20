"use server"
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Transaction } from "@/types/Transaction";

async function getTransactions(): Promise<{
    transactions?: Transaction[];
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
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { transactions };
    } catch (error) {
        return { error: 'Database error' };
    }
}

export default getTransactions