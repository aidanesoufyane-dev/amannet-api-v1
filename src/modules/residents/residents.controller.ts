import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { asyncHandler } from '../../utils/async-handler';
import { ResidentModel } from './residents.model';
import { UserModel } from '../users/users.model';
import { BuildingModel } from '../buildings/buildings.model';
import { ChatGroupModel } from '../chat/chat.model';

// Auto-setup chat groups when a resident is validated
async function setupChatForResident(residentEmail: string | undefined, apartmentNumber: string) {
  const syndic = await UserModel.findOne({ userType: 'Syndic' });
  if (!syndic) return;

  // Find building and ensure building group exists with syndic + all building users
  const building = await BuildingModel.findOne({ 'apartments.number': apartmentNumber });
  if (building) {
    const aptNumbers = building.apartments.map((a) => a.number);
    const buildingUsers = await UserModel.find({ apartmentNumber: { $in: aptNumbers } });
    const buildingUserIds = buildingUsers.map((u) => u._id);

    const existingGroup = await ChatGroupModel.findOne({ name: building.name, isGroup: true });
    if (!existingGroup) {
      await ChatGroupModel.create({
        name: building.name,
        isGroup: true,
        members: [syndic._id, ...buildingUserIds],
      });
    } else {
      await ChatGroupModel.findByIdAndUpdate(existingGroup._id, {
        $addToSet: { members: { $each: [syndic._id, ...buildingUserIds] } },
      });
    }
  }

  // If resident has a user account, create a DM with the syndic
  if (residentEmail) {
    const user = await UserModel.findOne({ email: residentEmail });
    if (user) {
      const existingDm = await ChatGroupModel.findOne({
        isGroup: false,
        members: { $all: [syndic._id, user._id] },
      });
      if (!existingDm) {
        await ChatGroupModel.create({
          name: syndic.fullName,
          isGroup: false,
          members: [syndic._id, user._id],
        });
      }
    }
  }
}

// Add resident name to their building apartment's residents array
async function addToApartment(fullName: string, apartmentNumber: string) {
  await BuildingModel.findOneAndUpdate(
    { 'apartments.number': apartmentNumber },
    { $addToSet: { 'apartments.$.residents': fullName } },
  );
}

// Remove resident name from their building apartment's residents array
async function removeFromApartment(fullName: string, apartmentNumber: string) {
  await BuildingModel.findOneAndUpdate(
    { 'apartments.number': apartmentNumber },
    { $pull: { 'apartments.$.residents': fullName } },
  );
}

export const listResidents = asyncHandler(async (_req: Request, res: Response) => {
  const residents = await ResidentModel.find().sort({ createdAt: -1 });
  res.json(residents);
});

export const createResident = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, apartmentNumber, status, email, phone, password, userType } = req.body;

  if (!fullName || !apartmentNumber) {
    res.status(400).json({ message: 'fullName and apartmentNumber are required' });
    return;
  }

  let hasAccount = false;

  if (email && password) {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      fullName,
      email,
      phone: phone || '',
      apartmentNumber,
      password: hashedPassword,
      userType: userType || 'Locataire',
    });
    hasAccount = true;
  }

  const finalStatus = status ?? 'pending';
  const resident = await ResidentModel.create({
    fullName,
    apartmentNumber,
    status: finalStatus,
    ...(email && { email }),
    ...(phone && { phone }),
    ...(userType && { userType }),
    hasAccount,
  });

  if (finalStatus === 'validated') {
    await addToApartment(fullName, apartmentNumber);
    await setupChatForResident(email, apartmentNumber);
  }

  res.status(201).json(resident);
});

export const updateResident = asyncHandler(async (req: Request, res: Response) => {
  const { password, ...rest } = req.body;

  const existing = await ResidentModel.findById(req.params.id);

  // If a new password is provided, update it on the linked User account too
  if (password && rest.email) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.findOneAndUpdate({ email: rest.email }, { password: hashedPassword });
  }

  const resident = await ResidentModel.findByIdAndUpdate(req.params.id, rest, { new: true });

  if (existing && resident) {
    const oldName = existing.fullName;
    const oldApt = existing.apartmentNumber;
    const oldStatus = existing.status;
    const newName = resident.fullName;
    const newApt = resident.apartmentNumber;
    const newStatus = resident.status;

    const nameOrAptChanged = oldName !== newName || oldApt !== newApt;

    // Remove from old apartment if was validated and something changed
    if (oldStatus === 'validated' && (nameOrAptChanged || newStatus !== 'validated')) {
      await removeFromApartment(oldName, oldApt);
    }

    // Add to new apartment if now validated
    if (newStatus === 'validated' && (nameOrAptChanged || oldStatus !== 'validated')) {
      await addToApartment(newName, newApt);
      await setupChatForResident(resident.email, newApt);
    }
  }

  res.json(resident);
});

export const deleteResident = asyncHandler(async (req: Request, res: Response) => {
  const resident = await ResidentModel.findById(req.params.id);
  if (resident) {
    if (resident.email) {
      await UserModel.findOneAndDelete({ email: resident.email });
    }
    if (resident.status === 'validated') {
      await removeFromApartment(resident.fullName, resident.apartmentNumber);
    }
  }
  await ResidentModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
