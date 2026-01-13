const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting cleanup...');
  
  // Clean Order tables
  console.log('Deleting Order Items...');
  await prisma.orderItem.deleteMany();
  
  console.log('Deleting Order Drinks...');
  await prisma.orderDrink.deleteMany();
  
  console.log('Deleting Orders...');
  await prisma.order.deleteMany();
  
  // Clean Counters
  console.log('Resetting Queue Counters...');
  await prisma.queueCounter.deleteMany();
  
  console.log('Cleanup finished. All orders and revenue data cleared.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
