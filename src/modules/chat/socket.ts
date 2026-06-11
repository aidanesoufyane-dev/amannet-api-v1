import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Server as HttpServer } from 'http';
import { ChatGroupModel, ChatMessageModel } from './chat.model';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-development';

let _io: Server | null = null;

export const getIO = (): Server | null => _io;

export const initSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
      
      if (!token) {
        return next(new Error('Authentication Error: Missing Token'));
      }

      const cleanToken = token.replace('Bearer ', '');
      const decoded = jwt.verify(cleanToken, JWT_SECRET) as { userId: string };
      
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication Error: Invalid Token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId} on socket ${socket.id}`);

    // Join a specific room (either personal room for DMs or a Group room)
    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${userId} left room ${roomId}`);
    });

    // Handle sending a new message
    socket.on('send_message', async (data: { groupId: string; content: string; mediaUrl?: string }) => {
      try {
        const { groupId, content, mediaUrl } = data;

        // Verify the user is part of the group
        const group = await ChatGroupModel.findById(groupId);
        if (!group || !group.members.includes(userId)) {
          return socket.emit('error', { message: 'Group not found or access denied.' });
        }

        // Save message to database
        const message = await ChatMessageModel.create({
          groupId,
          senderId: userId,
          content,
          mediaUrl,
          readBy: [userId], // Sender automatically reads their message
        });

        const populatedMessage = await message.populate('senderId', 'fullName profileImageUrl');

        // Broadcast the message to everyone in the room (including the sender, or use socket.to().emit to exclude sender)
        io.to(groupId).emit('receive_message', populatedMessage);
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  _io = io;
  return io;
};
