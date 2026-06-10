import { Schema, model, Document } from 'mongoose';

export interface IChatGroup extends Document {
  name?: string; // Optional for direct messages
  isGroup: boolean;
  members: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const chatGroupSchema = new Schema<IChatGroup>(
  {
    name: { type: String },
    isGroup: { type: Boolean, default: false },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

chatGroupSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const ChatGroupModel = model<IChatGroup>('ChatGroup', chatGroupSchema);

export interface IChatMessage extends Document {
  groupId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  content: string;
  mediaUrl?: string;
  readBy: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'ChatGroup', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

chatMessageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const ChatMessageModel = model<IChatMessage>('ChatMessage', chatMessageSchema);
