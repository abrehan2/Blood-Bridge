// IMPORTS -
import prisma from "@/config/prismaConfig";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const user = await prisma.user.findFirst({
      where: {
        activateToken: {
          some: {
            AND: [
              {
                token,
              },

              {
                createdAt: {
                  gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
                },
              },
            ],
          },
        },
        active: false,
      },
    });

    if (!user) {
      throw new Error("Your activation link has expired");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        active: true,
      },
    });

    await prisma.activateToken.delete({
      where: {
        token,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Your account has been verified!" }),
      { status: 200 }
    );
  } catch (error: any) {
    throw new Error(error?.message);
  }
}
