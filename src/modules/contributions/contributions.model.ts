import { Schema, model, Document } from 'mongoose';

export interface IContribution extends Document {
  apartmentNumber: string;
  residentName: string;
  monthlyContribution: number;
  paymentStatus: 'Paid' | 'Unpaid';
  paymentDate?: Date;
  remainingBalance: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContribution>(
  {
    apartmentNumber: { type: String, required: true },
    residentName: { type: String, required: true },
    monthlyContribution: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
    paymentDate: { type: Date },
    remainingBalance: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true },
);

contributionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const ContributionModel = model<IContribution>('Contribution', contributionSchema);
