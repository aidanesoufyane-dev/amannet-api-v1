import { Schema, model, Document } from 'mongoose';

export interface IAccessControl extends Document {
  label: string;
  status: 'operational' | 'restricted';
  createdAt: Date;
  updatedAt: Date;
}

const accessControlSchema = new Schema<IAccessControl>(
  {
    label: { type: String, required: true },
    status: {
      type: String,
      enum: ['operational', 'restricted'],
      default: 'operational',
    },
  },
  { timestamps: true },
);

accessControlSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const AccessControlModel = model<IAccessControl>('AccessControl', accessControlSchema);
