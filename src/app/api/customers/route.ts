import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MembershipLevel, Prisma } from "@prisma/client";

// GET /api/customers - List all customers with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const membership = searchParams.get("membership") as MembershipLevel | null;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: Prisma.CustomerWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (membership && ["BRONZE", "SILVER", "GOLD"].includes(membership)) {
      where.membership = membership;
    }

    // Build orderBy
    const orderBy: Record<string, string> = {};
    if (["createdAt", "totalSpent", "orderCount", "name"].includes(sortBy)) {
      orderBy[sortBy] = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    // Get total count
    const total = await prisma.customer.count({ where });

    // Get paginated customers
    const customers = await prisma.customer.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: { orders: true, notes: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pelanggan" },
      { status: 500 },
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Nama dan nomor telepon wajib diisi" },
        { status: 400 },
      );
    }

    // Clean phone number (remove spaces, dashes)
    const cleanPhone = phone.replace(/[\s\-]/g, "");

    // Check if phone already exists
    const existing = await prisma.customer.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Nomor telepon sudah terdaftar" },
        { status: 400 },
      );
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name,
        phone: cleanPhone,
        email: email || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: customer,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat pelanggan baru" },
      { status: 500 },
    );
  }
}
