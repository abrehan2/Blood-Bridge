// IMPORTS -
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismaDb";
import GoogleProvider from "next-auth/providers/google";
import NextAuth, { AuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: "",
            clientSecret: ""
        })
    ]
}