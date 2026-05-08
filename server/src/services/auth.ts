import prisma from "../utils/prisma"
import { hashPassword, verifyPassword } from "../utils/hash"
import { generateToken } from "../utils/jwt"

export const registerUser = async (username: string, email: string, password: string) => {
    const existingUser =
        await prisma.user.findUnique({
            where: { email }
        })
    if (existingUser) {
        throw new Error("User already exists")
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })

    const token = generateToken(user.id)


}