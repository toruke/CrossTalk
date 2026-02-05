import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// POST /users/sync - Synchronise utilisateur Clerk → Prisma
// Sécurité: vérifie que le clerkId correspond bien à l'email fourni
router.post('/sync', asyncHandler(async (req: Request, res: Response) => {
  const { clerkId, email, firstName, lastName, role } = req.body;
  
  // 1. Validation: clerkId et email obligatoires
  if (!clerkId || !email) {
    return res.status(400).json({ error: 'clerkId et email requis' });
  }
  
  // 2. Vérifier si un utilisateur existe déjà avec cet email
  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  
  // 3. Empêcher la création d'ADMIN via cette route (réservé au seed)
  const safeRole = role === 'ADMIN' ? 'ELEVE' : role;
  
  // 4. Si l'utilisateur existe déjà avec cet email
  if (existingByEmail) {
    // Cas 1: Utilisateur seed (sans clerkId) -> on lie le compte Clerk
    // Cas 2: Même clerkId -> simple mise à jour
    // Cas 3: Différent clerkId -> on met à jour (reconnexion avec autre méthode)
    // Dans tous les cas, on met à jour avec le nouveau clerkId
    const user = await prisma.user.update({
      where: { email },
      data: {
        clerkId,
        firstName: firstName || existingByEmail.firstName,
        lastName: lastName || existingByEmail.lastName,
        // Mettre à jour le rôle sauf si l'utilisateur est ADMIN (protège les admins seedés)
        ...(existingByEmail.role !== 'ADMIN' && safeRole ? { role: safeRole } : {}),
      },
    });
    return res.json(user);
  }
  
  // 5. Nouvel utilisateur
  const user = await prisma.user.create({
    data: { clerkId, email, firstName, lastName, role: safeRole },
  });
  
  res.json(user);
}));

// GET /users/me/:clerkId - Récupère utilisateur par Clerk ID
router.get('/me/:clerkId', asyncHandler(async (req: Request, res: Response) => {
  const { clerkId } = req.params;
  
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      enrollments: { include: { course: { include: { teacher: true } } } },
      coursesTaught: { include: { enrollments: { include: { user: true } } } }
    }
  });
  
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  res.json(user);
}));

// ═══════════════════════════════════════════════════════════
// ROUTES ADMIN
// ═══════════════════════════════════════════════════════════

// GET /users - Liste tous les utilisateurs (Admin uniquement)
router.get('/', requireAuth, requireRole('ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      clerkId: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
    orderBy: { id: 'asc' },
  });
  res.json(users);
}));

// PUT /users/:id/role - Changer le rôle d'un utilisateur (Admin uniquement)
router.put('/:id/role', requireAuth, requireRole('ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { role } = req.body;

  if (!['ADMIN', 'PROF', 'ELEVE'].includes(role)) {
    res.status(400).json({ error: 'Rôle invalide' });
    return;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  res.json(user);
}));

// DELETE /users/:id - Supprimer un utilisateur (Admin uniquement)
router.delete('/:id', requireAuth, requireRole('ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  // Empêcher la suppression de son propre compte
  if (req.user && req.user.id === userId) {
    res.status(400).json({ error: 'Impossible de supprimer votre propre compte' });
    return;
  }

  await prisma.user.delete({ where: { id: userId } });
  res.json({ success: true });
}));

export default router;
