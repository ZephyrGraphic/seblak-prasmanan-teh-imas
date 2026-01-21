// Script to seed authentic menu data from Teh Imas
// Run with: npx ts-node scripts/seed-menu.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MENU_DATA = {
  toppings: [
    // Rp 1.000
    { name: "Krupuk", price: 1000, emoji: "🥟" },
    { name: "Tiktak", price: 1000, emoji: "🍘" },
    { name: "Cuangki Lidah", price: 1000, emoji: "🥟" },
    { name: "Japlak", price: 1000, emoji: "🥟" },
    { name: "Chikua", price: 1000, emoji: "🥢" },
    { name: "Udang", price: 1000, emoji: "🦐" },
    { name: "Cilok Aci", price: 1000, emoji: "🍡" },
    { name: "Cirawang", price: 1000, emoji: "🥟" },
    { name: "Basreng", price: 1000, emoji: "🍟" },
    { name: "Kembang Cumi", price: 1000, emoji: "🦑" },
    { name: "Otak-otak Singapur", price: 1000, emoji: "🍢" },
    { name: "Baso Tahu", price: 1000, emoji: "🥟" },
    { name: "Swister", price: 1000, emoji: "🌭" },
    { name: "Kwetiau", price: 1000, emoji: "🍜" },
    { name: "Telor Puyuh", price: 1000, emoji: "🥚" },
    { name: "Jamur Enoki", price: 1000, emoji: "🍄" },
    // Rp 1.500
    { name: "Mie", price: 1500, emoji: "🍜" },
    // Rp 2.000
    { name: "Ekor Udang", price: 2000, emoji: "🦐" },
    { name: "Sosis", price: 2000, emoji: "🌭" },
    { name: "Dumpling Ayam", price: 2000, emoji: "🥟" },
    { name: "Dumpling Keju", price: 2000, emoji: "🧀" },
    { name: "Odeng", price: 2000, emoji: "🍢" },
    { name: "Fishrol", price: 2000, emoji: "🐟" },
    // Rp 3.000
    { name: "Baso Urat", price: 3000, emoji: "🍡" },
    { name: "Telor Ayam", price: 3000, emoji: "🥚" },
  ],
  drinks: [
    { name: "Puding Melon", price: 2000, emoji: "🍈" },
    { name: "Puding Mangga", price: 2000, emoji: "🥭" },
    { name: "Nutrisari Aneka Rasa", price: 3000, emoji: "🧃" },
    { name: "Aqua Viva", price: 4000, emoji: "💧" },
    { name: "Teh Pucuk", price: 4000, emoji: "🍵" },
  ],
};

async function seedMenu() {
  console.log("🌱 Seeding menu data...\n");

  // Seed toppings
  console.log("📦 Adding toppings...");
  for (const topping of MENU_DATA.toppings) {
    try {
      await prisma.stockItem.upsert({
        where: { name: topping.name },
        update: {
          price: topping.price,
          emoji: topping.emoji,
          category: "topping",
          isAvailable: true,
        },
        create: {
          name: topping.name,
          unit: "pcs",
          price: topping.price,
          category: "topping",
          emoji: topping.emoji,
          stock: 100,
          isAvailable: true,
        },
      });
      console.log(
        `  ✓ ${topping.emoji} ${topping.name} - Rp ${topping.price.toLocaleString()}`,
      );
    } catch (error) {
      console.error(`  ✗ Failed to add ${topping.name}:`, error);
    }
  }

  // Seed drinks
  console.log("\n🥤 Adding drinks...");
  for (const drink of MENU_DATA.drinks) {
    try {
      await prisma.stockItem.upsert({
        where: { name: drink.name },
        update: {
          price: drink.price,
          emoji: drink.emoji,
          category: "drink",
          isAvailable: true,
        },
        create: {
          name: drink.name,
          unit: "pcs",
          price: drink.price,
          category: "drink",
          emoji: drink.emoji,
          stock: 100,
          isAvailable: true,
        },
      });
      console.log(
        `  ✓ ${drink.emoji} ${drink.name} - Rp ${drink.price.toLocaleString()}`,
      );
    } catch (error) {
      console.error(`  ✗ Failed to add ${drink.name}:`, error);
    }
  }

  // Update store settings
  console.log("\n⚙️ Updating store settings...");
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {
      whatsappNumber: "6283813731449",
      danaNumber: "083813731449",
      danaAccountName: "TEH IMAS",
    },
    create: {
      id: "default",
      isOpen: true,
      soundNotification: true,
      ttsNotification: false,
      whatsappNumber: "6283813731449",
      danaNumber: "083813731449",
      danaAccountName: "TEH IMAS",
    },
  });
  console.log("  ✓ WhatsApp: 083813731449");
  console.log("  ✓ DANA: 083813731449 (A/N TEH IMAS)");

  console.log("\n✅ Menu seeding completed!");
  console.log(`   Total toppings: ${MENU_DATA.toppings.length}`);
  console.log(`   Total drinks: ${MENU_DATA.drinks.length}`);
}

seedMenu()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
