import { Schema, model, Document } from 'mongoose';

export interface IIncident extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  reportedBy?: string;
  description: string;
  type: string; // e.g., 'plumbing', 'electrical', 'cleaning'
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  location?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const incidentSchema = new Schema<IIncident>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    reportedBy: { type: String },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    location: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

incidentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const IncidentModel = model<IIncident>('Incident', incidentSchema);
