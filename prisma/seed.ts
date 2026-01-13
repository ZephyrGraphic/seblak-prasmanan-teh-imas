import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'tehimas123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash: hashedPassword,
    },
  });
  console.log('✅ Admin user created:', admin.username);

  // Create default store settings
  const settings = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      isOpen: true,
      soundNotification: true,
      ttsNotification: false,
      whatsappNumber: '6281234567890',
      danaNumber: '081234567890',
      danaAccountName: 'TEH IMAS',
    },
  });
  console.log('✅ Store settings created');

  // Initialize queue counter for today
  const today = new Date().toISOString().split('T')[0];
  const queueCounter = await prisma.queueCounter.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      date: today,
      dineIn: 0,
      takeaway: 0,
    },
  });
  console.log('✅ Queue counter initialized for:', today);

  // Create initial stock items
  const stockItems = [
    { name: 'Kerupuk Orange', unit: 'kg', stock: 12, status: 'OK' as const },
    { name: 'Mie Instan', unit: 'pcs', stock: 45, status: 'OK' as const },
    { name: 'Telur Ayam', unit: 'kg', stock: 2, status: 'LOW' as const },
    { name: 'Sosis Sapi', unit: 'pack', stock: 5, status: 'OK' as const },
    { name: 'Bakso Sapi', unit: 'pack', stock: 0, status: 'OUT' as const },
    { name: 'Ceker Ayam', unit: 'kg', stock: 3, status: 'OK' as const },
    { name: 'Tulang Ayam', unit: 'kg', stock: 2, status: 'LOW' as const },
    { name: 'Jamur Kuping', unit: 'kg', stock: 1, status: 'LOW' as const },
    { name: 'Makaroni', unit: 'kg', stock: 8, status: 'OK' as const },
    { name: 'Batagor', unit: 'pcs', stock: 20, status: 'OK' as const },
    { name: 'Siomay', unit: 'pcs', stock: 15, status: 'OK' as const },
  ];

  for (const item of stockItems) {
    await prisma.stockItem.upsert({
      where: { name: item.name },
      update: { stock: item.stock, status: item.status },
      create: item,
    });
  }
  console.log('✅ Stock items created:', stockItems.length, 'items');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
