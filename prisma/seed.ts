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

    // Créer les budgets pour les 5 prochaines années
    console.log('\n📊 Création des budgets...');
    
    const budgets = [
      // Budgets Pro - Dépenses
      {
        name: 'Assurance professionnelle',
        type: 'expense',
        life: 'pro',
        amount: 150.00,
        prelevementDay: 15,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Frais de déplacement',
        type: 'expense',
        life: 'pro',
        amount: 80.00,
        prelevementDay: 1,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Matériel informatique',
        type: 'expense',
        life: 'pro',
        amount: 250.00, // 250€ en centimes
        prelevementDay: 1,
        shouldBeCopiedNextMonth: false
      },
      {
        name: 'Formation continue',
        type: 'expense',
        life: 'pro',
        amount: 120.00, // 120€ en centimes
        prelevementDay: 1,
        shouldBeCopiedNextMonth: false
      },
      {
        name: 'Marketing et publicité',
        type: 'expense',
        life: 'pro',
        amount: 300.00, // 300€ en centimes
        prelevementDay: 5,
        shouldBeCopiedNextMonth: true
      },
      // Budgets Pro - Transferts
      {
        name: 'Investissement actions pro',
        type: 'transfer',
        life: 'pro',
        amount: 500.00, // 500€ en centimes
        prelevementDay: 25,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Épargne de précaution pro',
        type: 'transfer',
        life: 'pro',
        amount: 200.00, // 200€ en centimes
        prelevementDay: 28,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Retraite complémentaire',
        type: 'transfer',
        life: 'pro',
        amount: 150.00, // 150€ en centimes
        prelevementDay: 15,
        shouldBeCopiedNextMonth: true
      },
      // Budgets Perso - Dépenses
      {
        name: 'Assurance habitation',
        type: 'expense',
        life: 'perso',
        amount: 120.00, // 120€ en centimes
        prelevementDay: 10,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Assurance voiture',
        type: 'expense',
        life: 'perso',
        amount: 180.00, // 180€ en centimes
        prelevementDay: 20,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Courses alimentaires',
        type: 'expense',
        life: 'perso',
        amount: 400.00, // 400€ en centimes
        prelevementDay: 1,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Essence et transport',
        type: 'expense',
        life: 'perso',
        amount: 150.00, // 150€ en centimes
        prelevementDay: 1,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Loisirs et sorties',
        type: 'expense',
        life: 'perso',
        amount: 200.00, // 200€ en centimes
        prelevementDay: 1,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Vêtements et soins',
        type: 'expense',
        life: 'perso',
        amount: 100.00, // 100€ en centimes
        prelevementDay: 1,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Électricité et gaz',
        type: 'expense',
        life: 'perso',
        amount: 80.00, // 80€ en centimes
        prelevementDay: 15,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Internet et téléphone',
        type: 'expense',
        life: 'perso',
        amount: 60.00, // 60€ en centimes
        prelevementDay: 5,
        shouldBeCopiedNextMonth: true
      },
      // Budgets Perso - Transferts
      {
        name: 'Investissement actions perso',
        type: 'transfer',
        life: 'perso',
        amount: 300.00, // 300€ en centimes
        prelevementDay: 25,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Épargne de précaution',
        type: 'transfer',
        life: 'perso',
        amount: 250.00, // 250€ en centimes
        prelevementDay: 28,
        shouldBeCopiedNextMonth: true
      },
      {
        name: 'Épargne projet',
        type: 'transfer',
        life: 'perso',
        amount: 150.00, // 150€ en centimes
        prelevementDay: 15,
        shouldBeCopiedNextMonth: true
      }
    ];

    // Créer les budgets pour l'année précédente
    const previousYear = new Date().getFullYear();

    for (let month = 1; month <= 12; month++) {
      for (const budgetData of budgets) {
        await prisma.budget.create({
          data: {
            ...budgetData,
            year: previousYear,
            month
          }
        });
      }
      console.log(`✅ Budgets créés pour ${month}/${previousYear}`);
    }

    // Créer les transactions de revenus et de dépenses
    console.log('\n💰 Création des transactions...');

    // Récupérer les comptes
    const proBankAccount = await prisma.account.findFirst({
      where: { name: 'Compte Principal Pro', life: 'pro' }
    });

    const persoBankAccount = await prisma.account.findFirst({
      where: { name: 'Compte Principal Perso', life: 'perso' }
    });

    if (!proBankAccount || !persoBankAccount) {
      throw new Error('Comptes bancaires non trouvés');
    }

    for (let month = 1; month <= 12; month++) {
      // Créer les revenus mensuels
      await prisma.transaction.create({
        data: {
          type: 'income',
          amount: 3000.00, // 3000€ en centimes
          label: 'Salaire professionnel',
          date: new Date(previousYear, month - 1, 5), // 5 du mois
          accountId: proBankAccount.id
        }
      });

      await prisma.transaction.create({
        data: {
          type: 'income',
          amount: 200000, // 2000€ en centimes
          label: 'Salaire personnel',
          date: new Date(previousYear, month - 1, 5), // 5 du mois
          accountId: persoBankAccount.id
        }
      });

      // Créer les dépenses basées sur les budgets
      for (const budgetData of budgets) {
        // Trouver le budget créé pour ce mois
        const budget = await prisma.budget.findFirst({
          where: {
            name: budgetData.name,
            year: previousYear,
            month: month
          }
        });

        if (budget) {
          // Calculer le montant de la dépense avec variation de +/- 20%
          const variation = (Math.random() - 0.5) * 0.4; // -20% à +20%
          const expenseAmount = Math.round(budgetData.amount * (1 + variation));
          
          // Déterminer le compte selon la vie du budget
          const accountId = budgetData.life === 'pro' ? proBankAccount.id : persoBankAccount.id;

          await prisma.transaction.create({
            data: {
              type: 'expense',
              amount: -expenseAmount, // Montant négatif pour une dépense
              label: budgetData.name,
              date: new Date(previousYear, month - 1, budgetData.prelevementDay),
              accountId: accountId,
              budgetId: budget.id
            }
          });
        }
      }

      console.log(`✅ Transactions créées pour ${month}/${previousYear}`);
    }

    // Recalculer les soldes de tous les comptes
    console.log('\n🔄 Recalcul des soldes des comptes...');
    
    const allAccounts = await prisma.account.findMany();
    const balanceService = new (await import('~/core/services/balance.service')).BalanceService(prisma);

    for (const account of allAccounts) {
      await balanceService.recalculateAccountBalance(account.id.toString());
      console.log(`✅ Solde recalculé pour: ${account.name}`);
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