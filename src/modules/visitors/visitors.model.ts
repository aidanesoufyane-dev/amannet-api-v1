import { Schema, model, Document } from 'mongoose';

export interface IVisitor extends Document {
  name: string;
  invitedBy: string;
  visitAt: Date;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    name: { type: String, required: true },
    invitedBy: { type: String, required: true },
    visitAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

visitorSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const VisitorModel = model<IVisitor>('Visitor', visitorSchema);
