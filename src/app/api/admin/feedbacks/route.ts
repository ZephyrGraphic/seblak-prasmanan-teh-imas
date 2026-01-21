import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/feedbacks - List all feedbacks for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const rating = searchParams.get("rating");

    const where: { rating?: number } = {};
    if (rating) {
      where.rating = parseInt(rating);
    }

    const total = await prisma.customerFeedback.count({ where });

    const feedbacks = await prisma.customerFeedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            membership: true,
          },
        },
      },
    });

    // Calculate average rating
    const avgResult = await prisma.customerFeedback.aggregate({
      _avg: { rating: true },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: feedbacks,
      stats: {
        averageRating: avgResult._avg.rating?.toFixed(1) || "0",
        totalFeedbacks: avgResult._count,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data feedback" },
      { status: 500 },
    );
  }
}
