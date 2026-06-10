import { Schema, model, Document } from 'mongoose';

export interface IAccessLog extends Document {
  personName: string;
  action: 'Entry' | 'Exit';
  time: Date;
  isEntry: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accessLogSchema = new Schema<IAccessLog>(
  {
    personName: { type: String, required: true },
    action: { type: String, enum: ['Entry', 'Exit'], required: true },
    time: { type: Date, required: true },
    isEntry: { type: Boolean, default: true },
  },
  { timestamps: true },
);

accessLogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const AccessLogModel = model<IAccessLog>('AccessLog', accessLogSchema);
