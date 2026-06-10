import type { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AuthRequest } from '../../middlewares/auth';
import { ChatGroupModel, ChatMessageModel } from './chat.model';

export const getMyGroups = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const groups = await ChatGroupModel.find({ members: userId }).populate('members', 'fullName profileImageUrl');

  const groupsWithMeta = await Promise.all(
    groups.map(async (group) => {
      const lastMsg = await ChatMessageModel.findOne({ groupId: group.id })
        .sort({ createdAt: -1 })
        .populate('senderId', 'fullName');
      return {
        ...group.toJSON(),
        lastMessage: lastMsg?.content ?? '',
        lastMessageTime: lastMsg?.createdAt ?? group.createdAt,
      };
    }),
  );

  res.json(groupsWithMeta);
});

export const getChatHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId } = req.params;

  // Verify membership
  const group = await ChatGroupModel.findById(groupId);
  if (!group || !group.members.includes(userId)) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  const messages = await ChatMessageModel.find({ groupId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('senderId', 'fullName profileImageUrl');

  res.json(messages.reverse()); // Send chronologically
});

export const createGroup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, members, isGroup } = req.body;

  // Ensure current user is in members
  const memberList = Array.isArray(members) ? members : [];
  if (!memberList.includes(userId)) {
    memberList.push(userId);
  }

  const group = await ChatGroupModel.create({
    name,
    isGroup: isGroup || false,
    members: memberList,
  });

  res.status(201).json(group);
});
