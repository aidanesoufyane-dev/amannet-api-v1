import { Schema, model, Document } from 'mongoose';

export interface IPackage extends Document {
  residentName: string;
  apartmentNumber: string;
  buildingName: string;
  deliveryCompany: string;
  description: string;
  price: number;
  dateReceived: Date;
  timeReceived: string;
  status: 'Pending' | 'Delivered' | 'Collected';
  dateCollected?: Date;
  timeCollected?: string;
  personCollected?: string;
  createdAt: Date;
  updatedAt: Date;
}

const packageSchema = new Schema<IPackage>(
  {
    residentName: { type: String, required: true },
    apartmentNumber: { type: String, required: true },
    buildingName: { type: String, required: true },
    deliveryCompany: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    dateReceived: { type: Date, required: true },
    timeReceived: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Delivered', 'Collected'],
      default: 'Pending',
    },
    dateCollected: { type: Date },
    timeCollected: { type: String },
    personCollected: { type: String },
  },
  { timestamps: true },
);

packageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const PackageModel = model<IPackage>('Package', packageSchema);
