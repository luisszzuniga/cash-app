import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    let userId: bigint;

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await hash('password123', 10)
        }
      });
      userId = user.id;
      console.log('✅ Utilisateur créé avec succès');
    } else {
      userId = existingUser.id;
      console.log('✅ Utilisateur existe déjà');
    }

    // Créer les comptes bancaires
    const accounts = [
      // Comptes Pro
      {
        name: 'Compte Principal Pro',
        type: 'bank',
        life: 'pro',
        balance: 0,
        description: 'Compte principal professionnel',
        rib: 'FR1234567890123456789012345'
      },
      {
        name: 'Compte Secondaire Pro',
        type: 'bank',
        life: 'pro',
        balance: 0,
        description: 'Compte secondaire professionnel',
        rib: 'FR1234567890123456789012346'
      },
      {
        name: 'Livret A Pro',
        type: 'savings',
        life: 'pro',
        balance: 0,
        description: 'Épargne sécurisée professionnelle',
        rib: 'FR1234567890123456789012347'
      },
      {
        name: 'PEA Pro',
        type: 'portfolio',
        life: 'pro',
        balance: 0,
        description: 'Plan d\'Épargne en Actions professionnel',
        rib: 'FR1234567890123456789012348'
      },
      // Comptes Perso
      {
        name: 'Compte Principal Perso',
        type: 'bank',
        life: 'perso',
        balance: 0,
        description: 'Compte principal personnel',
        rib: 'FR1234567890123456789012349'
      },
      {
        name: 'Livret A Perso',
        type: 'savings',
        life: 'perso',
        balance: 0,
        description: 'Épargne sécurisée personnelle',
        rib: 'FR1234567890123456789012350'
      },
      {
        name: 'Compte-titre Perso',
        type: 'portfolio',
        life: 'perso',
        balance: 0,
        description: 'Compte titres personnel',
        rib: 'FR1234567890123456789012351'
      }
    ];

    // Créer les comptes
    for (const accountData of accounts) {
      const existingAccount = await prisma.account.findFirst({
        where: {
          name: accountData.name
        }
      });

      if (!existingAccount) {
        await prisma.account.create({
          data: accountData
        });
        console.log(`✅ Compte créé: ${accountData.name}`);
      } else {
        console.log(`ℹ️ Compte existe déjà: ${accountData.name}`);
      }
    }
    
  } catch (error: any) {
    console.error('❌ Erreur lors du seeding:', error);
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