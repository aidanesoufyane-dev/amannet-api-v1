import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { UserModel } from './modules/users/users.model';
import { BuildingModel } from './modules/buildings/buildings.model';
import { ResidentModel } from './modules/residents/residents.model';
import { VisitorModel } from './modules/visitors/visitors.model';
import { IncidentModel } from './modules/incidents/incidents.model';
import { AnnouncementModel } from './modules/announcements/announcements.model';
import { DocumentModel } from './modules/documents/documents.model';
import { PackageModel } from './modules/packages/packages.model';
import { ContributionModel } from './modules/contributions/contributions.model';
import { BillModel } from './modules/payments/bills.model';
import { NotificationModel } from './modules/notifications/notifications.model';
import { GuardModel } from './modules/security/guards.model';
import { AccessControlModel } from './modules/security/access-control.model';
import { AccessLogModel } from './modules/security/access-log.model';
import { ChatGroupModel, ChatMessageModel } from './modules/chat/chat.model';

const MONGO_URI = process.env.MONGO_URI!;

async function seed() {
  console.log('🌱 Connecting to database...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected.');

  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    UserModel.deleteMany({}),
    BuildingModel.deleteMany({}),
    ResidentModel.deleteMany({}),
    VisitorModel.deleteMany({}),
    IncidentModel.deleteMany({}),
    AnnouncementModel.deleteMany({}),
    DocumentModel.deleteMany({}),
    PackageModel.deleteMany({}),
    ContributionModel.deleteMany({}),
    BillModel.deleteMany({}),
    NotificationModel.deleteMany({}),
    GuardModel.deleteMany({}),
    AccessControlModel.deleteMany({}),
    AccessLogModel.deleteMany({}),
    ChatGroupModel.deleteMany({}),
    ChatMessageModel.deleteMany({}),
  ]);
  console.log('✅ Cleared.');

  // ─── USERS ────────────────────────────────────────────────────────────────
  console.log('👤 Seeding users...');
  const hash = (p: string) => bcrypt.hash(p, 10);

  const [syndic, resident1, resident2, resident3, guard1] = await Promise.all([
    UserModel.create({ fullName: 'Karim Benali', email: 'syndic@amanet.com', phone: '+212 600 000 001', apartmentNumber: 'SYNDIC', password: await hash('Syndic@123'), userType: 'Syndic' }),
    UserModel.create({ fullName: 'Ahmed Alami', email: 'ahmed@amanet.com', phone: '+212 600 000 002', apartmentNumber: 'A101', password: await hash('Ahmed@123'), userType: 'Propriétaire' }),
    UserModel.create({ fullName: 'Fatima Zahra', email: 'fatima@amanet.com', phone: '+212 600 000 003', apartmentNumber: 'A102', password: await hash('Fatima@123'), userType: 'Locataire' }),
    UserModel.create({ fullName: 'Youssef Idrissi', email: 'youssef@amanet.com', phone: '+212 600 000 004', apartmentNumber: 'B201', password: await hash('Youssef@123'), userType: 'Propriétaire' }),
    UserModel.create({ fullName: 'Hassan Mourabit', email: 'guard@amanet.com', phone: '+212 600 000 005', apartmentNumber: 'GUARD', password: await hash('Guard@123'), userType: 'Guard' }),
  ]);

  // ─── BUILDINGS ────────────────────────────────────────────────────────────
  console.log('🏢 Seeding buildings...');
  await BuildingModel.insertMany([
    {
      name: 'Résidence Al Amal - Bâtiment A',
      zone: 'Zone Nord',
      apartmentsCount: 12,
      apartments: [
        { number: 'A101', surface: 85, rentAmount: 4500, isRented: false, residents: ['Ahmed Alami'] },
        { number: 'A102', surface: 65, rentAmount: 3200, isRented: true, residents: ['Fatima Zahra'] },
        { number: 'A103', surface: 95, rentAmount: 5000, isRented: false, residents: [] },
        { number: 'A201', surface: 75, rentAmount: 3800, isRented: false, residents: ['Mohamed Tazi'] },
        { number: 'A202', surface: 110, rentAmount: 6000, isRented: false, residents: [] },
      ],
    },
    {
      name: 'Résidence Al Amal - Bâtiment B',
      zone: 'Zone Sud',
      apartmentsCount: 10,
      apartments: [
        { number: 'B201', surface: 90, rentAmount: 4800, isRented: false, residents: ['Youssef Idrissi'] },
        { number: 'B202', surface: 70, rentAmount: 3500, isRented: true, residents: ['Sara Bennani'] },
        { number: 'B301', surface: 120, rentAmount: 7000, isRented: false, residents: [] },
      ],
    },
  ]);

  // ─── RESIDENTS ────────────────────────────────────────────────────────────
  console.log('🏠 Seeding residents...');
  await ResidentModel.insertMany([
    { fullName: 'Ahmed Alami', apartmentNumber: 'A101', status: 'validated', email: 'ahmed@amanet.com', phone: '+212 600 000 002', userType: 'Propriétaire', hasAccount: true },
    { fullName: 'Fatima Zahra', apartmentNumber: 'A102', status: 'validated', email: 'fatima@amanet.com', phone: '+212 600 000 003', userType: 'Locataire', hasAccount: true },
    { fullName: 'Mohamed Tazi', apartmentNumber: 'A201', status: 'validated' },
    { fullName: 'Youssef Idrissi', apartmentNumber: 'B201', status: 'validated', email: 'youssef@amanet.com', phone: '+212 600 000 004', userType: 'Propriétaire', hasAccount: true },
    { fullName: 'Sara Bennani', apartmentNumber: 'B202', status: 'validated' },
    { fullName: 'Nadia Chraibi', apartmentNumber: 'A103', status: 'pending' },
    { fullName: 'Omar Fassi', apartmentNumber: 'B301', status: 'pending' },
  ]);

  // ─── VISITORS ─────────────────────────────────────────────────────────────
  console.log('🚶 Seeding visitors...');
  await VisitorModel.insertMany([
    { name: 'Ali Qasim', invitedBy: 'Ahmed Alami', visitAt: new Date('2026-06-12T14:00:00'), status: 'approved' },
    { name: 'Leila Mansour', invitedBy: 'Fatima Zahra', visitAt: new Date('2026-06-13T10:00:00'), status: 'approved' },
    { name: 'Kamal Oulad', invitedBy: 'Youssef Idrissi', visitAt: new Date('2026-06-14T16:00:00'), status: 'pending' },
    { name: 'Samira Oukach', invitedBy: 'Mohamed Tazi', visitAt: new Date('2026-06-11T09:00:00'), status: 'rejected' },
    { name: 'Rachid Filali', invitedBy: 'Ahmed Alami', visitAt: new Date('2026-06-15T11:00:00'), status: 'pending' },
  ]);

  // ─── INCIDENTS ────────────────────────────────────────────────────────────
  console.log('⚠️  Seeding incidents...');
  await IncidentModel.insertMany([
    { userId: resident1._id, title: 'Fuite d\'eau dans les communs', reportedBy: 'Ahmed Alami', description: 'Une fuite d\'eau importante a été détectée dans le couloir du rez-de-chaussée du Bâtiment A.', type: 'plumbing', status: 'in-progress', priority: 'high', location: 'Bâtiment A - RDC', images: [] },
    { userId: resident2._id, title: 'Panne d\'ascenseur', reportedBy: 'Fatima Zahra', description: 'L\'ascenseur du Bâtiment A est en panne depuis ce matin. Les résidents des étages supérieurs sont très gênés.', type: 'electrical', status: 'open', priority: 'high', location: 'Bâtiment A - Ascenseur', images: [] },
    { userId: resident3._id, title: 'Éclairage parking défaillant', reportedBy: 'Youssef Idrissi', description: 'Plusieurs ampoules du parking sont grillées, créant des zones sombres la nuit.', type: 'electrical', status: 'open', priority: 'medium', location: 'Parking Sous-sol', images: [] },
    { userId: resident1._id, title: 'Porte d\'entrée difficile à fermer', reportedBy: 'Ahmed Alami', description: 'La serrure de la porte d\'entrée principale est défectueuse.', type: 'maintenance', status: 'resolved', priority: 'low', location: 'Entrée Principale', images: [] },
    { userId: resident2._id, title: 'Bruit excessif - Appartement A201', reportedBy: 'Fatima Zahra', description: 'Des nuisances sonores importantes provenant de l\'appartement A201 perturbent le voisinage.', type: 'noise', status: 'open', priority: 'medium', location: 'Appartement A201', images: [] },
  ]);

  // ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────
  console.log('📢 Seeding announcements...');
  await AnnouncementModel.insertMany([
    { title: 'Réunion de Copropriété - Juin 2026', content: 'Nous vous invitons à la réunion annuelle de copropriété le 20 juin 2026 à 18h00 dans la salle commune du Bâtiment A. Ordre du jour : budget, travaux, règlement.', publishedAt: new Date('2026-06-01') },
    { title: 'Travaux d\'entretien - Piscine', content: 'La piscine commune sera fermée du 15 au 22 juin pour des travaux d\'entretien annuels. Nous nous excusons pour la gêne occasionnée.', publishedAt: new Date('2026-06-05') },
    { title: 'Nouveau règlement de stationnement', content: 'À partir du 1er juillet 2026, chaque appartement disposera d\'une place de parking numérotée. Les nouvelles cartes d\'accès seront distribuées à la réception.', publishedAt: new Date('2026-06-08') },
    { title: 'Coupure d\'eau - Maintenance réseau', content: 'Une coupure d\'eau générale aura lieu le 18 juin de 8h à 12h pour maintenance du réseau. Veuillez prévoir des réserves d\'eau.', publishedAt: new Date('2026-06-10') },
  ]);

  // ─── DOCUMENTS ────────────────────────────────────────────────────────────
  console.log('📄 Seeding documents...');
  await DocumentModel.insertMany([
    { name: 'Règlement de Copropriété 2026.pdf', size: '2.4 MB' },
    { name: 'Procès-verbal AG Mai 2026.pdf', size: '856 KB' },
    { name: 'Budget Prévisionnel 2026.xlsx', size: '124 KB' },
    { name: 'Contrat Gardiennage.pdf', size: '1.1 MB' },
    { name: 'Assurance Immeuble 2026.pdf', size: '3.2 MB' },
    { name: 'Plan d\'Evacuation.pdf', size: '650 KB' },
  ]);

  // ─── PACKAGES ─────────────────────────────────────────────────────────────
  console.log('📦 Seeding packages...');
  await PackageModel.insertMany([
    { residentName: 'Ahmed Alami', apartmentNumber: 'A101', buildingName: 'Bâtiment A', deliveryCompany: 'Amazon', description: 'Colis électronique', price: 299.99, dateReceived: new Date('2026-06-09'), timeReceived: '09:30', status: 'Pending' },
    { residentName: 'Fatima Zahra', apartmentNumber: 'A102', buildingName: 'Bâtiment A', deliveryCompany: 'DHL', description: 'Vêtements', price: 89.50, dateReceived: new Date('2026-06-09'), timeReceived: '11:15', status: 'Collected', dateCollected: new Date('2026-06-09'), timeCollected: '18:00', personCollected: 'Fatima Zahra' },
    { residentName: 'Youssef Idrissi', apartmentNumber: 'B201', buildingName: 'Bâtiment B', deliveryCompany: 'Jumia', description: 'Électroménager', price: 1200.00, dateReceived: new Date('2026-06-08'), timeReceived: '14:00', status: 'Pending' },
    { residentName: 'Mohamed Tazi', apartmentNumber: 'A201', buildingName: 'Bâtiment A', deliveryCompany: 'Amana', description: 'Livres', price: 45.00, dateReceived: new Date('2026-06-07'), timeReceived: '10:00', status: 'Collected', dateCollected: new Date('2026-06-08'), timeCollected: '09:00', personCollected: 'Mohamed Tazi' },
    { residentName: 'Sara Bennani', apartmentNumber: 'B202', buildingName: 'Bâtiment B', deliveryCompany: 'FedEx', description: 'Documents administratifs', price: 0, dateReceived: new Date('2026-06-10'), timeReceived: '08:45', status: 'Pending' },
  ]);

  // ─── CONTRIBUTIONS ────────────────────────────────────────────────────────
  console.log('💰 Seeding contributions...');
  const contribData = [
    { apartmentNumber: 'A101', residentName: 'Ahmed Alami' },
    { apartmentNumber: 'A102', residentName: 'Fatima Zahra' },
    { apartmentNumber: 'A201', residentName: 'Mohamed Tazi' },
    { apartmentNumber: 'B201', residentName: 'Youssef Idrissi' },
    { apartmentNumber: 'B202', residentName: 'Sara Bennani' },
  ];
  const contributions = [];
  for (const c of contribData) {
    for (let m = 1; m <= 6; m++) {
      const paid = m < 5;
      contributions.push({
        ...c,
        monthlyContribution: 450,
        paymentStatus: paid ? 'Paid' : 'Unpaid',
        paymentDate: paid ? new Date(2026, m - 1, 5) : undefined,
        remainingBalance: paid ? 0 : 450,
        month: m,
        year: 2026,
      });
    }
  }
  await ContributionModel.insertMany(contributions);

  // ─── BILLS ────────────────────────────────────────────────────────────────
  console.log('🧾 Seeding bills...');
  const residents = [resident1, resident2, resident3];
  const bills = [];
  for (const r of residents) {
    bills.push(
      { userId: r._id, title: 'Frais de Syndic - Juin 2026', description: 'Charges de copropriété pour la gestion de l\'immeuble.', amount: 450, dueDate: new Date('2026-06-30'), month: 6, year: 2026, category: 'syndic', status: 'unpaid', isPayable: true, breakdown: [{ title: 'Conciergerie & Gardiennage', amount: 200 }, { title: 'Éclairage des Communs', amount: 50 }, { title: 'Maintenance Ascenseur', amount: 100 }, { title: 'Assurance Immeuble', amount: 100 }] },
      { userId: r._id, title: 'Facture d\'Eau - Juin 2026', description: 'Votre consommation d\'eau pour le mois.', amount: 85, dueDate: new Date('2026-06-25'), month: 6, year: 2026, category: 'communalUtilities', status: 'unpaid', isPayable: false, invoiceData: { invoiceNumber: `WAT-2026-0${residents.indexOf(r) + 1}`, period: 'Juin 2026', consumption: '14 m³', meterReading: '5240 m³' } },
      { userId: r._id, title: 'Frais de Syndic - Mai 2026', description: 'Charges de copropriété pour la gestion de l\'immeuble.', amount: 450, dueDate: new Date('2026-05-31'), month: 5, year: 2026, category: 'syndic', status: 'paid', paymentDate: new Date('2026-05-10'), paymentMethod: 'card', transactionId: `txn_may_${r._id}`, isPayable: true },
    );
  }
  await BillModel.insertMany(bills);

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
  console.log('🔔 Seeding notifications...');
  await NotificationModel.insertMany([
    { title: 'Bienvenue sur AmanNet', message: 'Votre compte a été créé avec succès. Bienvenue dans la résidence Al Amal!', type: 'info', isRead: false, sentAt: new Date('2026-06-01') },
    { title: 'Nouveau colis reçu', message: 'Un colis de Amazon vous attend à la réception. Merci de venir le récupérer.', type: 'package', isRead: false, sentAt: new Date('2026-06-09') },
    { title: 'Réunion de copropriété', message: 'Rappel : réunion annuelle le 20 juin à 18h00 en salle commune.', type: 'announcement', isRead: true, sentAt: new Date('2026-06-05') },
    { title: 'Facture disponible', message: 'Votre facture de syndic pour Juin 2026 est disponible. Montant : 450 MAD.', type: 'payment', isRead: false, sentAt: new Date('2026-06-10') },
    { title: 'Incident mis à jour', message: 'Votre signalement "Panne d\'ascenseur" est en cours de traitement.', type: 'incident', isRead: true, sentAt: new Date('2026-06-08') },
  ]);

  // ─── GUARDS ───────────────────────────────────────────────────────────────
  console.log('💂 Seeding guards...');
  await GuardModel.insertMany([
    { name: 'Hassan Mourabit', location: 'Entrée Principale', isOnline: true, lastCheckIn: new Date() },
    { name: 'Rachid Ouali', location: 'Parking Nord', isOnline: true, lastCheckIn: new Date() },
    { name: 'Brahim Zaki', location: 'Portail Arrière', isOnline: false, lastCheckIn: new Date(Date.now() - 3600000) },
  ]);

  // ─── ACCESS CONTROLS ──────────────────────────────────────────────────────
  console.log('🔐 Seeding access controls...');
  await AccessControlModel.insertMany([
    { label: 'Portail d\'Entrée Principal', status: 'operational' },
    { label: 'Entrée Parking Sous-sol', status: 'operational' },
    { label: 'Accès Ascenseur de Service', status: 'restricted' },
    { label: 'Porte de Sécurité Toit', status: 'restricted' },
  ]);

  // ─── CHAT GROUPS + MESSAGES ───────────────────────────────────────────────
  console.log('💬 Seeding chat groups...');
  const allResidents = [resident1._id, resident2._id, resident3._id];
  const generalGroup = await ChatGroupModel.create({
    name: 'Syndic - Général',
    isGroup: true,
    members: [syndic._id, ...allResidents],
  });
  const batAGroup = await ChatGroupModel.create({
    name: 'Résidents Bâtiment A',
    isGroup: true,
    members: [syndic._id, resident1._id, resident2._id],
  });
  const adminDmGroup = await ChatGroupModel.create({
    name: 'Administration',
    isGroup: false,
    members: [syndic._id, resident1._id],
  });

  await ChatMessageModel.insertMany([
    { groupId: generalGroup._id, senderId: syndic._id, content: 'Bonjour à tous ! Réunion de copropriété le 20 juin à 18h00.', readBy: [syndic._id] },
    { groupId: generalGroup._id, senderId: resident1._id, content: 'Merci pour l\'information, je serai présent.', readBy: [syndic._id, resident1._id] },
    { groupId: generalGroup._id, senderId: resident2._id, content: 'Moi aussi, à bientôt !', readBy: [syndic._id, resident1._id, resident2._id] },
    { groupId: batAGroup._id, senderId: syndic._id, content: 'Rappel : nettoyage des communs jeudi matin.', readBy: [syndic._id] },
    { groupId: batAGroup._id, senderId: resident1._id, content: 'Quelqu\'un a vu mes clés ? Je les ai perdues hier.', readBy: [syndic._id, resident1._id] },
    { groupId: adminDmGroup._id, senderId: syndic._id, content: 'Votre demande de badge parking a été validée.', readBy: [syndic._id, resident1._id] },
    { groupId: adminDmGroup._id, senderId: resident1._id, content: 'Merci beaucoup !', readBy: [syndic._id, resident1._id] },
  ]);

  // ─── ACCESS LOGS ──────────────────────────────────────────────────────────
  console.log('📋 Seeding access logs...');
  const logNames = ['Ahmed Alami', 'Fatima Zahra', 'Youssef Idrissi', 'Livraison DHL', 'Mohamed Tazi', 'Visiteur - Ali Qasim', 'Sara Bennani'];
  const logs = logNames.map((name, i) => ({
    personName: name,
    action: i % 2 === 0 ? 'Entry' : 'Exit',
    time: new Date(Date.now() - i * 1800000),
    isEntry: i % 2 === 0,
  }));
  await AccessLogModel.insertMany(logs);

  // ─── DONE ─────────────────────────────────────────────────────────────────
  console.log('\n✅ Seed complete!\n');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│                    LOGIN CREDENTIALS                   │');
  console.log('├─────────────┬───────────────────────┬──────────────────┤');
  console.log('│ Role        │ Email                 │ Password         │');
  console.log('├─────────────┼───────────────────────┼──────────────────┤');
  console.log('│ Syndic      │ syndic@amanet.com     │ Syndic@123       │');
  console.log('│ Propriétaire│ ahmed@amanet.com      │ Ahmed@123        │');
  console.log('│ Locataire   │ fatima@amanet.com     │ Fatima@123       │');
  console.log('│ Propriétaire│ youssef@amanet.com    │ Youssef@123      │');
  console.log('│ Guard       │ guard@amanet.com      │ Guard@123        │');
  console.log('└─────────────┴───────────────────────┴──────────────────┘');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
