"use server"
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface TransactionData {
    text: string;
    amount: number;
}

interface TransactionResult {
    data?: TransactionData;
    error?: string
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
    const textValue = formData.get('text');
    const amountValue = formData.get('amount');

    // check for input values
    if(!textValue || textValue === "" || !amountValue) {
        return {error: 'Text or Amount is missing'}
    }

    const text: string = textValue.toString()
    const amount: number = parseFloat(amountValue.toString());

    // get logged in user
    const { userId }: { userId: string | null } = await auth()
    
    // check for user
    if(!userId) {
        return {error: 'User Not Found'}
    }

    try {
        const transactionData: TransactionData = await prisma.transaction.create({
            data: {
                text,
                amount,
                userId
            }
        })
        revalidatePath('/')
        return { data: transactionData }
    } catch(error) {
        return {error: 'Transaction Not Added'}
    }
}

export default addTransaction