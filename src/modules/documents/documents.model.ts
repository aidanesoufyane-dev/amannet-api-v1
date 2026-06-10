import { Schema, model, Document } from 'mongoose';

export interface IDocument extends Document {
  name: string;
  size: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    fileUrl: { type: String },
  },
  { timestamps: true },
);

documentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const DocumentModel = model<IDocument>('Document', documentSchema);
