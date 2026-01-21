// Script to delete all old orders
// Run with: npx tsx scripts/clear-orders.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearOrders() {
  console.log("🗑️ Menghapus semua pesanan lama...\n");

  try {
    // Delete order drinks first (foreign key constraint)
    const deletedDrinks = await prisma.orderDrink.deleteMany({});
    console.log(`  ✓ Deleted ${deletedDrinks.count} order drinks`);

    // Delete order items (foreign key constraint)
    const deletedItems = await prisma.orderItem.deleteMany({});
    console.log(`  ✓ Deleted ${deletedItems.count} order items`);

    // Delete all orders
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`  ✓ Deleted ${deletedOrders.count} orders`);

    // Reset queue counter
    await prisma.queueCounter.deleteMany({});
    console.log(`  ✓ Reset queue counters`);

    console.log("\n✅ Semua pesanan lama berhasil dihapus!");
    console.log("   Queue number akan dimulai dari awal.");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

clearOrders()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
