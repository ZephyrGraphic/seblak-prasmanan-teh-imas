import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/member/profile?id=xxx - Get member profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID member diperlukan" },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        membership: true,
        totalSpent: true,
        orderCount: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            queueNumber: true,
            totalPrice: true,
            status: true,
            createdAt: true,
          },
        },
        feedbacks: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Member tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Get member profile error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data profil" },
      { status: 500 },
    );
  }
}
