import type { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AuthRequest } from '../../middlewares/auth';
import { ChatGroupModel, ChatMessageModel } from './chat.model';
import { UserModel } from '../users/users.model';
import { BuildingModel } from '../buildings/buildings.model';
import { getIO } from './socket';

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

// List all resident/propriétaire users for the admin to message
export const getResidentUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const users = await UserModel.find(
    { userType: { $in: ['Locataire', 'Propriétaire'] } },
    'fullName email apartmentNumber userType',
  ).sort({ fullName: 1 });
  res.json(users);
});

// Find or create a direct message conversation between admin and a resident
export const getOrCreateDirect = asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.user?.id;
  const { recipientId } = req.body;

  if (!recipientId) {
    res.status(400).json({ message: 'recipientId is required' });
    return;
  }

  const existing = await ChatGroupModel.findOne({
    isGroup: false,
    members: { $all: [adminId, recipientId] },
  });

  if (existing) {
    res.json(existing);
    return;
  }

  const group = await ChatGroupModel.create({
    isGroup: false,
    members: [adminId, recipientId],
  });

  res.status(201).json(group);
});

// Get group info with populated members
export const getGroupInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId } = req.params;

  const group = await ChatGroupModel.findById(groupId).populate('members', 'fullName apartmentNumber userType');
  if (!group || !group.members.map(String).includes(String(userId))) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  res.json(group);
});

// Setup default conversations for a resident: DM with syndic + building group
export const setupConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const userApartment = req.user?.apartmentNumber;

  // 1. Find syndic
  const syndic = await UserModel.findOne({ userType: 'Syndic' });
  if (!syndic) {
    res.status(404).json({ message: 'Syndic not found' });
    return;
  }

  // 2. Find or create DM with syndic
  let syndicGroup = await ChatGroupModel.findOne({
    isGroup: false,
    members: { $all: [userId, syndic._id] },
  });
  if (!syndicGroup) {
    syndicGroup = await ChatGroupModel.create({
      name: syndic.fullName,
      isGroup: false,
      members: [userId, syndic._id],
    });
  } else if (!syndicGroup.name) {
    syndicGroup = await ChatGroupModel.findByIdAndUpdate(
      syndicGroup._id,
      { $set: { name: syndic.fullName } },
      { new: true },
    ) ?? syndicGroup;
  }

  // 3. Find user's building and create/find group chat
  let buildingGroup = null;
  let buildingName = null;
  if (userApartment) {
    const building = await BuildingModel.findOne({ 'apartments.number': userApartment });
    if (building) {
      buildingName = building.name;
      const aptNumbers = building.apartments.map((a) => a.number);
      const buildingUsers = await UserModel.find({ apartmentNumber: { $in: aptNumbers } });
      const buildingUserIds = buildingUsers.map((u) => u._id);

      buildingGroup = await ChatGroupModel.findOne({ name: building.name, isGroup: true });
      if (!buildingGroup) {
        buildingGroup = await ChatGroupModel.create({
          name: building.name,
          isGroup: true,
          members: [syndic._id, ...buildingUserIds],
        });
      } else if (!buildingGroup.members.map(String).includes(String(userId))) {
        await ChatGroupModel.findByIdAndUpdate(buildingGroup._id, { $addToSet: { members: userId } });
      }
    }
  }

  res.json({
    syndicGroupId: syndicGroup._id,
    buildingGroupId: buildingGroup?._id ?? null,
    syndicName: syndic.fullName,
    buildingName,
  });
});

// Send a message to a group/conversation
export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const senderId = req.user?.id;
  const { groupId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    res.status(400).json({ message: 'content is required' });
    return;
  }

  const group = await ChatGroupModel.findById(groupId);
  if (!group || !group.members.map(String).includes(String(senderId))) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  const message = await ChatMessageModel.create({
    groupId,
    senderId,
    content: content.trim(),
  });

  const populated = await message.populate('senderId', 'fullName');

  // Broadcast to socket room so mobile clients get real-time updates
  getIO()?.to(groupId).emit('receive_message', populated.toJSON());

  res.status(201).json(populated);
});
