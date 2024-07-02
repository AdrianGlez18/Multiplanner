import { model, models, Schema, Document } from "mongoose";

export interface GroupInterface extends Document {
    _id: string;
    authEmail: string;
    groupName: string;
    groupEmails: string[];
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema = new Schema({
  authEmail: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  groupEmails: {
    type: [String],
    required: true,
  },
});

const Group = models?.Group || model("Group", GroupSchema);

export default Group;