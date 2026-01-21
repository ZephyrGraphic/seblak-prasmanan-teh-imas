import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/customers/lookup?phone=xxx - Lookup customer by phone
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Nomor telepon diperlukan" },
        { status: 400 },
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[\s\-]/g, "");

    const customer = await prisma.customer.findUnique({
      where: { phone: cleanPhone },
      select: {
        id: true,
        name: true,
        phone: true,
        membership: true,
        totalSpent: true,
        orderCount: true,
      },
    });

    if (!customer) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Pelanggan tidak ditemukan",
      });
    }

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Failed to lookup customer:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mencari pelanggan" },
      { status: 500 },
    );
  }
}
