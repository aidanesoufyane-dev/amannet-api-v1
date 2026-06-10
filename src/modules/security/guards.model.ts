import { Schema, model, Document } from 'mongoose';

export interface IGuard extends Document {
  name: string;
  location: string;
  isOnline: boolean;
  lastCheckIn?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const guardSchema = new Schema<IGuard>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    lastCheckIn: { type: Date },
  },
  { timestamps: true },
);

guardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const GuardModel = model<IGuard>('Guard', guardSchema);
