import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚧 Démarrage du seed (Schema strict : Langue + Niveau)...');

  // 1. NETTOYAGE (Ordre inverse pour éviter les erreurs de clés étrangères)
  console.log('🧹 Nettoyage de la DB...');
  await prisma.message.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('👨‍🏫 Création des Professeurs...');

  // --- CRÉATION DES PROFS ---
  
  // Profs d'Anglais
  const pSmith = await prisma.user.create({
    data: { email: 'smith@school.com', password: '123', name: 'John Smith', role: 'PROF' }
  });
  const pJohnson = await prisma.user.create({
    data: { email: 'johnson@school.com', password: '123', name: 'Emily Johnson', role: 'PROF' }
  });

  // Profs d'Espagnol
  const pGarcia = await prisma.user.create({
    data: { email: 'garcia@school.com', password: '123', name: 'Maria Garcia', role: 'PROF' }
  });
  const pRodriguez = await prisma.user.create({
    data: { email: 'rodriguez@school.com', password: '123', name: 'Carlos Rodriguez', role: 'PROF' }
  });

  // Profs Divers (Allemand, Asiatique, Italien)
  const pMuller = await prisma.user.create({
    data: { email: 'muller@school.com', password: '123', name: 'Hans Muller', role: 'PROF' }
  });
  const pTanaka = await prisma.user.create({
    data: { email: 'tanaka@school.com', password: '123', name: 'Kenji Tanaka', role: 'PROF' }
  });
  const pRossi = await prisma.user.create({
    data: { email: 'rossi@school.com', password: '123', name: 'Giulia Rossi', role: 'PROF' }
  });

  console.log('📚 Création du Catalogue (Langue + Niveau uniquement)...');

  // --- CATALOGUE ANGLAIS ---
  await prisma.course.create({ data: { language: 'Anglais', level: 'A1', teacherId: pSmith.id } });
  await prisma.course.create({ data: { language: 'Anglais', level: 'A2', teacherId: pSmith.id } });
  await prisma.course.create({ data: { language: 'Anglais', level: 'B1', teacherId: pSmith.id } });
  await prisma.course.create({ data: { language: 'Anglais', level: 'B2', teacherId: pJohnson.id } });
  await prisma.course.create({ data: { language: 'Anglais', level: 'C1', teacherId: pJohnson.id } });
  await prisma.course.create({ data: { language: 'Anglais', level: 'C2', teacherId: pJohnson.id } });

  // --- CATALOGUE ESPAGNOL ---
  await prisma.course.create({ data: { language: 'Espagnol', level: 'A1', teacherId: pRodriguez.id } });
  await prisma.course.create({ data: { language: 'Espagnol', level: 'A2', teacherId: pRodriguez.id } });
  await prisma.course.create({ data: { language: 'Espagnol', level: 'B1', teacherId: pRodriguez.id } });
  await prisma.course.create({ data: { language: 'Espagnol', level: 'B2', teacherId: pGarcia.id } });
  await prisma.course.create({ data: { language: 'Espagnol', level: 'C1', teacherId: pGarcia.id } });

  // --- CATALOGUE ALLEMAND ---
  await prisma.course.create({ data: { language: 'Allemand', level: 'A1', teacherId: pMuller.id } });
  await prisma.course.create({ data: { language: 'Allemand', level: 'A2', teacherId: pMuller.id } });
  await prisma.course.create({ data: { language: 'Allemand', level: 'B1', teacherId: pMuller.id } });
  await prisma.course.create({ data: { language: 'Allemand', level: 'B2', teacherId: pMuller.id } });

  // --- CATALOGUE JAPONAIS ---
  await prisma.course.create({ data: { language: 'Japonais', level: 'A1', teacherId: pTanaka.id } });
  await prisma.course.create({ data: { language: 'Japonais', level: 'A2', teacherId: pTanaka.id } });
  await prisma.course.create({ data: { language: 'Japonais', level: 'B1', teacherId: pTanaka.id } });

  // --- CATALOGUE ITALIEN ---
  const courseItalienA1 = await prisma.course.create({ data: { language: 'Italien', level: 'A1', teacherId: pRossi.id } });
  await prisma.course.create({ data: { language: 'Italien', level: 'A2', teacherId: pRossi.id } });
  await prisma.course.create({ data: { language: 'Italien', level: 'B1', teacherId: pRossi.id } });

  console.log('👨‍🎓 Création des Élèves et inscriptions...');

  // --- CRÉATION D'UN ÉLÈVE ---
  const eleve1 = await prisma.user.create({
    data: { email: 'jean@eleve.com', password: '123', name: 'Jean Dupont', role: 'ELEVE' }
  });

  // Récupérer quelques cours pour les inscriptions
  const coursAnglaisA1 = await prisma.course.findFirst({ where: { language: 'Anglais', level: 'A1' } });
  const coursEspagnolB1 = await prisma.course.findFirst({ where: { language: 'Espagnol', level: 'B1' } });
  const coursAllemandA2 = await prisma.course.findFirst({ where: { language: 'Allemand', level: 'A2' } });

  // --- INSCRIPTIONS DE L'ÉLÈVE ---
  if (coursAnglaisA1) {
    await prisma.enrollment.create({
      data: { userId: eleve1.id, courseId: coursAnglaisA1.id }
    });
  }
  if (coursEspagnolB1) {
    await prisma.enrollment.create({
      data: { userId: eleve1.id, courseId: coursEspagnolB1.id }
    });
  }
  if (coursAllemandA2) {
    await prisma.enrollment.create({
      data: { userId: eleve1.id, courseId: coursAllemandA2.id }
    });
  }
  await prisma.enrollment.create({
    data: { userId: eleve1.id, courseId: courseItalienA1.id }
  });

  console.log(`✅ Élève créé: ${eleve1.name} (ID: ${eleve1.id}) avec 4 inscriptions`);

  console.log('✅ Base de données rechargée avec succès !');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
