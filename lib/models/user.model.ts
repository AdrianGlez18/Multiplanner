import { model, models, Schema, Document } from "mongoose";

export interface UserInterface extends Document {
    _id: string;
    authEmail: string;
    googleAccessToken: string;
    googleRefreshToken: string[];
    zoomAccessToken: string;
    zoomRefreshToken: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema({
  authEmail: {
    type: String,
    required: true,
    unique: true
  },
  googleAccessToken: {
    type: String,
    required: true,
  },
  googleRefreshToken: {
    type: String,
    required: true,
  },
  zoomAccessToken: {
    type: String,
    required: true,
  },
  zoomRefreshToken: {
    type: String,
    required: true,
  },
});

const User = models?.User || model("User", UserSchema);

export default User;