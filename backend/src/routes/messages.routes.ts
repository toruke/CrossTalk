import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';

const router = Router();

// GET /messages/:userId/:contactId - Récupérer les messages entre deux utilisateurs
router.get('/:userId/:contactId', asyncHandler(async (req: Request, res: Response) => {
  const { userId, contactId } = req.params;
  
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: Number(userId), receiverId: Number(contactId) },
        { senderId: Number(contactId), receiverId: Number(userId) },
      ],
    },
    orderBy: { sentAt: 'asc' },
    include: { sender: true }
  });
  
  res.json(messages);
}));

// POST /messages - Envoyer un message
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { content, senderId, receiverId } = req.body;
  
  const newMessage = await prisma.message.create({
    data: {
      content,
      senderId: Number(senderId),
      receiverId: Number(receiverId)
    },
  });
  
  res.json(newMessage);
}));

export default router;
