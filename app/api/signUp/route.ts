// IMPORTS -
import { NextResponse } from "next/server";
import { Prisma as PrismaClient } from "@prisma/client";
import prisma from "@/config/prismaConfig";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    email,
    firstName,
    lastName,
    cnic,
    dob,
    city,
    password,
    confirmPassword,
  } = body;

  if (
    !email ||
    !firstName ||
    !lastName ||
    !cnic ||
    !dob ||
    !city ||
    !password ||
    !confirmPassword
  ) {
    return new NextResponse(
      JSON.stringify({ error: "Please fill all the fields" }),
      {
        status: 400,
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        cnic,
        dob,
        city,
        hashedPassword,
      },
    });

    const token = await prisma.activateToken.create({
      data: {
        token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
        userId: user.id,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClient.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // P2002 is the error code for unique constraint failed
        return new NextResponse(
          JSON.stringify({ error: "User already exists!" }),
          { status: 400 }
        );
      }

      return new NextResponse(
        JSON.stringify({ error: "Something went wrong" }),
        { status: 500 }
      );
    }
  }

  return new NextResponse(
    JSON.stringify({ message: "Your account has been created successfully!" }),
    { status: 200 }
  );
}
