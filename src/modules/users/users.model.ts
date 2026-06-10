import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  apartmentNumber: string;
  profileImageUrl?: string;
  userType: 'Propriétaire' | 'Locataire' | 'Syndic' | 'Guard';
  password?: string;
  firebaseUid?: string;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    apartmentNumber: { type: String, required: true },
    profileImageUrl: { type: String },
    userType: {
      type: String,
      enum: ['Propriétaire', 'Locataire', 'Syndic', 'Guard'],
      required: true,
      default: 'Locataire',
    },
    password: { type: String },
    firebaseUid: { type: String },
    fcmToken: { type: String },
  },
  {
    timestamps: true,
  }
);

// Map the `_id` to `id` for Flutter serialization
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
    delete (ret as any).password;
  }
});

export const UserModel = model<IUser>('User', userSchema);
