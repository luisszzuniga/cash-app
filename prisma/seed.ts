import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer l'utilisateur de test
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('⚠️  L\'utilisateur test@example.com existe déjà');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
    } else {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await hash('password123', 10)
        }
      });

      console.log('✅ Utilisateur créé avec succès:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
    }

    console.log('\n🔑 Credentials de test:');
    console.log('   Email: test@example.com');
    console.log('   Mot de passe: password123');
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
  }

  console.log('\n🎉 Seeding terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 