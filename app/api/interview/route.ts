import connectDB from "@/Database/config";
import Interview from "@/models/Interview.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try{
  const {
    role,
    type,
    level,
    techstack,
    questions,
    userId,
    finalized,
    coverImage,
    createdAt,
  } = await request.json();
  const interview = await Interview.create({
    role,
    type,
    level,
    techstack,
    questions,
    userId,
    finalized,
    coverImage,
    createdAt,
    pending: true,
  });
  if (!interview) {
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Failed to create interview" 
    }),
      { status: 500 }
    );
  }
  return new NextResponse(
    JSON.stringify({
      success: true,
      message: "Interview created successfully",
      data : interview,
    }),
    { status: 201 }
  );
}catch (error: any) {
    console.error("Error creating interview:", error);
  return new NextResponse(
    JSON.stringify({ 
      success: false, 
      message: "Failed to create interview" 
    }),
    { status: 500 }
  );
}
}
export function GET() {
  return new NextResponse(
    JSON.stringify({ success: true, data: "Thank you!" }),
    { status: 200 }
  );
}
