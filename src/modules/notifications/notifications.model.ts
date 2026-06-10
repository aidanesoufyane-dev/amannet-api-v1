import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

notificationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const NotificationModel = model<INotification>('Notification', notificationSchema);
