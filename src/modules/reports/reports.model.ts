import { Schema, model, Document } from 'mongoose';

export interface IReport extends Document {
  title: string;
  status: 'draft' | 'in-progress' | 'archived' | 'done';
  author: string;
  period: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'in-progress', 'archived', 'done'],
      default: 'draft',
    },
    author: { type: String, required: true },
    period: { type: String, required: true },
  },
  { timestamps: true },
);

reportSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const ReportModel = model<IReport>('Report', reportSchema);
