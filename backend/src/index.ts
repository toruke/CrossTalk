import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 4000;
const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════
// MIDDLEWARES
// ═══════════════════════════════════════════════════════════

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));

app.use(express.json());

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

// Route de test
app.get('/', (req, res) => {
  res.send('🚀 API CrossTalk est en ligne !');
});

// Routes legacy (compatibilité avec le frontend existant)
app.use('/my-courses', (req, res, next) => {
  req.url = `/courses/my${req.url}`;
  next();
}, routes);

app.use('/my-teachers', (req, res, next) => {
  req.url = `/teachers/my${req.url}`;
  next();
}, routes);

app.use('/my-students', (req, res, next) => {
  req.url = `/teachers/students${req.url}`;
  next();
}, routes);

app.use('/teacher-courses', (req, res, next) => {
  req.url = `/courses/teacher${req.url}`;
  next();
}, routes);

// Routes principales
app.use(routes);

// Gestion globale des erreurs
app.use(errorHandler);

// ═══════════════════════════════════════════════════════════
// WEBSOCKET SETUP
// ═══════════════════════════════════════════════════════════

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Map to store connected users: userId -> WebSocket
const connectedUsers = new Map<string, WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');
  let userId: string | null = null;

  ws.on('message', async (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'auth':
          userId = message.userId;
          if (userId) {
            connectedUsers.set(userId, ws);
            console.log(`User ${userId} authenticated`);
          }
          break;

        case 'loadMessages':
          if (!userId) return;

          const userIdInt = parseInt(userId);
          const contactIdInt = parseInt(message.contactId);

          const messages = await prisma.message.findMany({
            where: {
              OR: [
                { senderId: userIdInt, receiverId: contactIdInt },
                { senderId: contactIdInt, receiverId: userIdInt }
              ]
            },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            },
            orderBy: { sentAt: 'asc' }
          });

          // Map sentAt -> createdAt for frontend compatibility
          const mappedMessages = messages.map((m: typeof messages[number]) => ({
            ...m,
            createdAt: m.sentAt.toISOString(),
            senderId: String(m.senderId),
            receiverId: String(m.receiverId),
          }));

          ws.send(JSON.stringify({
            type: 'messagesLoaded',
            messages: mappedMessages
          }));
          break;

        case 'sendMessage':
          if (!userId) return;

          const senderIdInt = parseInt(userId);
          const receiverIdInt = parseInt(message.receiverId);

          const newMessage = await prisma.message.create({
            data: {
              senderId: senderIdInt,
              receiverId: receiverIdInt,
              content: message.content
            },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          });

          const mappedNewMessage = {
            ...newMessage,
            createdAt: newMessage.sentAt.toISOString(),
            senderId: String(newMessage.senderId),
            receiverId: String(newMessage.receiverId),
          };

          // Send to sender
          ws.send(JSON.stringify({
            type: 'newMessage',
            message: mappedNewMessage
          }));

          // Send to receiver if connected
          const receiverWs = connectedUsers.get(String(message.receiverId));
          if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify({
              type: 'newMessage',
              message: mappedNewMessage
            }));
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    if (userId) {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// DÉMARRAGE
// ═══════════════════════════════════════════════════════════

server.listen(port, () => {
  console.log(`📡 Serveur API démarré sur le port ${port}`);
  console.log(`🔌 WebSocket prêt sur ws://localhost:${port}`);
});

