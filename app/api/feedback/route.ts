import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";
import { NextRequest, NextResponse } from "next/server";
import FeedbackModel from "@/models/Feedback.model";
import connectDB from "@/Database/config";
import Interview from "@/models/Interview.model";

connectDB();
export async function POST(request: NextRequest) {
  const params = await request.json();
  const { interviewId, userId, transcript, feedbackId } = params;
  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");
console.log("Formatted transcript:", formattedTranscript);
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const existingFb = await FeedbackModel.findById(feedbackId);
    let fb = null;
    if (existingFb) {
      fb = await FeedbackModel.findByIdAndUpdate(
        feedbackId,feedback);
    }else{
       fb = await FeedbackModel.create(feedback);
      await Interview.findByIdAndUpdate(interviewId, {pending: false});
    }
    if (!fb) {
      return NextResponse.json({ success: false, message: "Failed to create the feetback" }, { status: 500 });
    }
    return NextResponse.json({ success: true, feedbackId: fb._id as string }, { status: 200 });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ success: false, message:"Something went wrong" },{status: 500});

  }
}
