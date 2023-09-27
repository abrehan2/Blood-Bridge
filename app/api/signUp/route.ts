// IMPORTS -
import { NextResponse, NextRequest } from "next/server";
import { Prisma as PrismaClient } from "@prisma/client";
import prisma from "@/config/prismaConfig";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import Mailgun from "mailgun.js";
import formData from "form-data";

export async function POST(req: NextRequest) {
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

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: "api",
      key: `${process.env.API_KEY}`,
    });

    const messageData = {
      from: `Blood Bridge <hello@${process.env.DOMAIN}>`,
      to: user.email,
      subject: "Account verification",
      text: `Dear ${user.firstName} ${user.lastName},\n\nPlease activate your account by clicking this link: http://localhost:3000/api/activate/${token.token}\n\nBest, \nBlood Bridge Team.`,
    };

    await client.messages.create(`${process.env.DOMAIN}`, messageData);
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
