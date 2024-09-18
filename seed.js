const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.card.createMany({
    data: [
      { title: 'Tarjeta 1', description: 'Descripción de la tarjeta 1', difficulty: 'Facil' },
      { title: 'Tarjeta 2', description: 'Descripción de la tarjeta 2', difficulty: 'Medio' },
      { title: 'Tarjeta 3', description: 'Descripción de la tarjeta 3', difficulty: 'Dificil' },
      { title: 'Tarjeta 4', description: 'Descripción de la tarjeta 4', difficulty: 'Facil' },
      { title: 'Tarjeta 5', description: 'Descripción de la tarjeta 5', difficulty: 'Medio' },
      { title: 'Tarjeta 6', description: 'Descripción de la tarjeta 6', difficulty: 'Dificil' },
      { title: 'Tarjeta 7', description: 'Descripción de la tarjeta 7', difficulty: 'Facil' },
      { title: 'Tarjeta 8', description: 'Descripción de la tarjeta 8', difficulty: 'Medio' },
      { title: 'Tarjeta 9', description: 'Descripción de la tarjeta 9', difficulty: 'Dificil' },
      { title: 'Tarjeta 10', description: 'Descripción de la tarjeta 10', difficulty: 'Facil' },
      { title: 'Tarjeta 11', description: 'Descripción de la tarjeta 11', difficulty: 'Medio' },
      { title: 'Tarjeta 12', description: 'Descripción de la tarjeta 12', difficulty: 'Dificil' },
    ],
  });

  console.log('Datos insertados correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
