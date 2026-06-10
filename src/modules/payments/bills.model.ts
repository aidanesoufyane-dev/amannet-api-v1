import { Schema, model, Document } from 'mongoose';

export interface IBillSubItem {
  title: string;
  amount: number;
}

export interface IInvoiceData {
  invoiceNumber: string;
  period: string;
  consumption: string;
  meterReading: string;
}

export interface IBill extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  month: number;
  year: number;
  category: 'syndic' | 'communalUtilities' | 'server';
  status: 'unpaid' | 'pending' | 'paid' | 'failed';
  paymentMethod?: 'card' | 'cash';
  transactionId?: string;
  breakdown?: IBillSubItem[];
  invoiceData?: IInvoiceData;
  isPayable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const billSchema = new Schema<IBill>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      enum: ['syndic', 'communalUtilities', 'server'],
      required: true,
    },
    status: {
      type: String,
      enum: ['unpaid', 'pending', 'paid', 'failed'],
      default: 'unpaid',
    },
    paymentMethod: { type: String, enum: ['card', 'cash'] },
    transactionId: { type: String },
    breakdown: [
      {
        title: { type: String },
        amount: { type: Number },
      },
    ],
    invoiceData: {
      invoiceNumber: { type: String },
      period: { type: String },
      consumption: { type: String },
      meterReading: { type: String },
    },
    isPayable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

billSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const BillModel = model<IBill>('Bill', billSchema);
