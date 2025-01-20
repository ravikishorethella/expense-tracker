'use server'
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function deleteTransaction(transactionId: string): Promise<{
    message?: string;
    error?: string;
}> {
    // get logged in user
    const { userId }: { userId: string | null } = await auth()

    // check for user
    if (!userId) {
        return { error: 'User Not Found' }
    }
    
    try {
        await prisma.transaction.delete({
            where: {
                id: transactionId,
                userId
            }
        })

        revalidatePath('/');
        
        return { message: 'Transaction deleted' };
    } catch (error) {
        return { error: 'Database error' };
    }
}

export default deleteTransaction