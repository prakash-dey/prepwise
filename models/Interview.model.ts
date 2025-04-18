import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInterview extends Document {
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: mongoose.Types.ObjectId;
  type: string;
  finalized: boolean;
  pending?: boolean;
}

const InterviewSchema: Schema<IInterview> = new Schema(
  {
    role: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    questions: {
      type: [String],
      default: [],
    },

    techstack: {
      type: [String],
      default: [],
    },

    createdAt: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    finalized: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid redefining the model during hot reload
const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);

export default Interview;
