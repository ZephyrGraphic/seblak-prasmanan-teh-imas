import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/customers/:id/notes - Get customer notes
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 },
      );
    }

    const notes = await prisma.customerNote.findMany({
      where: { customerId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Failed to fetch customer notes:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil catatan pelanggan" },
      { status: 500 },
    );
  }
}

// POST /api/customers/:id/notes - Add new note
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, createdBy } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Isi catatan tidak boleh kosong" },
        { status: 400 },
      );
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 },
      );
    }

    const note = await prisma.customerNote.create({
      data: {
        customerId: id,
        content: content.trim(),
        createdBy: createdBy || "Admin",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: note,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create customer note:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambah catatan" },
      { status: 500 },
    );
  }
}
