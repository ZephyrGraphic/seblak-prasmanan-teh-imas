import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/member/login - Login member dengan nama + phone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Nama dan nomor telepon wajib diisi" },
        { status: 400 },
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[\s\-]/g, "");

    // Find customer by phone
    const customer = await prisma.customer.findUnique({
      where: { phone: cleanPhone },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        membership: true,
        totalSpent: true,
        orderCount: true,
        createdAt: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Nomor telepon tidak terdaftar sebagai member",
        },
        { status: 404 },
      );
    }

    // Verify name matches (case insensitive)
    if (customer.name.toLowerCase() !== name.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Nama tidak sesuai dengan data member" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: customer,
      message: "Login berhasil!",
    });
  } catch (error) {
    console.error("Member login error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal melakukan login" },
      { status: 500 },
    );
  }
}
