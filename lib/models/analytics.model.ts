import { model, models, Schema, Document } from "mongoose";

const AnalyticsSchema = new Schema({
  authEmail: {
    type: String,
    required: true,
    unique: true
  },
  zoomScheduled: {
    type: Number,
    required: true,
  },
  meetScheduled: {
    type: Number,
    required: true,
  },
  averageUsers: {
    type: Number,
  },
  averageUsersZoom: {
    type: Number,
  },
  averageUsersMeet: {
    type: Number,
  },
  averageDuration: {
    type: Number,
  },
  averageDurationZoom: {
    type: Number,
  },
  averageDurationMeet: {
    type: Number,
  },
  zoomRecordings: {
    type: Number,
  },
  meetRecordings: {
    type: Number,
  },
  lastUpdated: {
    type: Date
  }

});

const Analytics = models?.Analytics || model("Analytics", AnalyticsSchema);

export default Analytics;