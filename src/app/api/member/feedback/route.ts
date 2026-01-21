import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/member/feedback?customerId=xxx - Get feedbacks for a customer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID diperlukan" },
        { status: 400 },
      );
    }

    const feedbacks = await prisma.customerFeedback.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Get feedbacks error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data feedback" },
      { status: 500 },
    );
  }
}

// POST /api/member/feedback - Submit feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, orderId, rating, comment } = body;

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID diperlukan" },
        { status: 400 },
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating harus antara 1-5" },
        { status: 400 },
      );
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Member tidak ditemukan" },
        { status: 404 },
      );
    }

    const feedback = await prisma.customerFeedback.create({
      data: {
        customerId,
        orderId: orderId || null,
        rating,
        comment: comment?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: feedback,
        message: "Terima kasih atas feedback Anda!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Submit feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim feedback" },
      { status: 500 },
    );
  }
}
