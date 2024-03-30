import mongoose, { Document, Schema } from "mongoose";

export interface User {
  username: string;
  email: string;
  password: string;
  token?: string;
}

export interface UserModel extends User, Document {}

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    token: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<UserModel>("Users", UserSchema);
