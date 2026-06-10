import { Schema, model, Document } from 'mongoose';

export interface IVisitor extends Document {
  name: string;
  type: string; // guest, delivery, etc.
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

visitorSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const QrVisitorModel = model<IVisitor>('QrVisitor', visitorSchema);

export interface IQrCode extends Document {
  token: string;
  visitorId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  expiry: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const qrCodeSchema = new Schema<IQrCode>(
  {
    token: { type: String, required: true, unique: true },
    visitorId: { type: Schema.Types.ObjectId, ref: 'QrVisitor', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiry: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

qrCodeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const QrCodeModel = model<IQrCode>('QrCode', qrCodeSchema);
