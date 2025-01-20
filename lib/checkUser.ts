import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db"

export const checkUser = async () => {
    const user = await currentUser();

    // check for the current logged in clerk user
    if(!user) {
        return null
    }

    // check if the user is already in the database
    const loggedInUser = await prisma.user.findUnique({
        where: {
            clerkUserId: user.id
        }
    })

    // If the user is in the database, return user
    if (loggedInUser) {
        return loggedInUser
    }

    // If not in database, create the new user
    const newUser = await prisma.user.create({
        data: {
            clerkUserId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })

    return newUser
}