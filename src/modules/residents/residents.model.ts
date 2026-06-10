import { Schema, model, Document } from 'mongoose';

export interface IResident extends Document {
  fullName: string;
  apartmentNumber: string;
  status: 'validated' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const residentSchema = new Schema<IResident>(
  {
    fullName: { type: String, required: true },
    apartmentNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ['validated', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

residentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const ResidentModel = model<IResident>('Resident', residentSchema);
