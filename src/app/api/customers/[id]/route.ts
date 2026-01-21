import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/customers/:id - Get customer details with orders
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            items: true,
            drinks: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pelanggan" },
      { status: 500 },
    );
  }
}

// PUT /api/customers/:id - Update customer
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, email, membership } = body;

    // Check if customer exists
    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 },
      );
    }

    // If phone changed, check for duplicates
    if (phone && phone !== existing.phone) {
      const cleanPhone = phone.replace(/[\s\-]/g, "");
      const duplicate = await prisma.customer.findFirst({
        where: {
          phone: cleanPhone,
          NOT: { id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: "Nomor telepon sudah digunakan pelanggan lain",
          },
          { status: 400 },
        );
      }
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: name || undefined,
        phone: phone ? phone.replace(/[\s\-]/g, "") : undefined,
        email: email !== undefined ? email || null : undefined,
        membership:
          membership && ["BRONZE", "SILVER", "GOLD"].includes(membership)
            ? membership
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Failed to update customer:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate pelanggan" },
      { status: 500 },
    );
  }
}

// DELETE /api/customers/:id - Delete customer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if customer exists
    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Delete customer (notes will cascade, orders will set null)
    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Pelanggan berhasil dihapus",
    });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pelanggan" },
      { status: 500 },
    );
  }
}
