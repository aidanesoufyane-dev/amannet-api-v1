import { Schema, model, Document } from 'mongoose';

export interface IApartment {
  number: string;
  surface: number;
  rentAmount?: number;
  isRented: boolean;
  residents: string[];
}

export interface IBuilding extends Document {
  name: string;
  zone: string;
  apartmentsCount: number;
  apartments: IApartment[];
  createdAt: Date;
  updatedAt: Date;
}

const apartmentSchema = new Schema<IApartment>(
  {
    number: { type: String, required: true },
    surface: { type: Number, required: true },
    rentAmount: { type: Number },
    isRented: { type: Boolean, default: false },
    residents: [{ type: String }],
  },
  { _id: false },
);

const buildingSchema = new Schema<IBuilding>(
  {
    name: { type: String, required: true },
    zone: { type: String, required: true },
    apartmentsCount: { type: Number, required: true },
    apartments: [apartmentSchema],
  },
  { timestamps: true },
);

buildingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
  }
});

export const BuildingModel = model<IBuilding>('Building', buildingSchema);
