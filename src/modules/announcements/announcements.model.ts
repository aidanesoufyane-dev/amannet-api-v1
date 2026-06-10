import { Schema, model, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

announcementSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const AnnouncementModel = model<IAnnouncement>('Announcement', announcementSchema);
