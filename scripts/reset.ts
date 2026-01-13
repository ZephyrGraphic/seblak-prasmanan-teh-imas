
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Resetting database...')
  
  // Delete all orders (will cascade delete items and drinks)
  await prisma.order.deleteMany()
  console.log('Deleted all orders')
  
  // Reset queue counter
  await prisma.queueCounter.update({
    where: { id: 'default' },
    data: {
      dineIn: 0,
      takeaway: 0
    }
  })
  console.log('Reset queue counter')
  
  console.log('Database reset complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
