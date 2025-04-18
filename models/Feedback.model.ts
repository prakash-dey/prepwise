import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInterviewFeedback extends Document {
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: Record<string, number>; // If it's a dictionary of scores
  strengths: string;
  areasForImprovement: string;
  finalAssessment: string;
  createdAt: Date;
}

const InterviewFeedbackSchema: Schema<IInterviewFeedback> = new Schema(
  {
    interviewId: {
      type: String,
      required: true,
      index: true,
      ref: "Interview",
    },
    userId: {
      type: String,
      required: true,
      index: true,
      ref: "User",
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryScores: [
      {
        name: String,
        score: Number,
        comment: String
      }
    ],
    strengths: [String],
    areasForImprovement: [String],
    finalAssessment: String,
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: false, 
    versionKey: false,
  }
);

// Avoid redefining the model during hot reload
const InterviewFeedback: Model<IInterviewFeedback> =
  mongoose.models.InterviewFeedback ||
  mongoose.model<IInterviewFeedback>("InterviewFeedback", InterviewFeedbackSchema);

export default InterviewFeedback;
