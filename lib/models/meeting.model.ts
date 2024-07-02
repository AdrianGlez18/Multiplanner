import { model, models, Schema, Document } from "mongoose";

export interface MeetingInterface extends Document {
    _id: string;
    authEmail: string;
    platform: "zoom" | "meet";
    title: string;
    description: string;
    url: string;
    members: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MeetingSchema = new Schema({
  authEmail: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  members: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  calendarId: {
    type: String
  },
  zoomId: {
    type: String
  }
});

const Meeting = models?.Meeting || model("Meeting", MeetingSchema);

export default Meeting;