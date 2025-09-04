import mongoose, { Schema, Document } from "mongoose";

export interface Asset extends Document {
  name: string;
  type: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<Asset>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Asset = mongoose.model<Asset>("Asset", AssetSchema);
