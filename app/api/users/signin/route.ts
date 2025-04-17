import connectDB from "@/Database/config";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const {email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide all required fields.",
        }),
        { status: 400 }
      );
    }
    // Check if user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User does not exist. Please sign up.",
        }),
        { status: 400 }
      );
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid credentials. Please try again.",
        }),
        { status: 400 }
      );
    }
    const token = await user.generateAuthToken();
    const response =  new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      }),
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour    
    });
    return response;
  } catch (error: any) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to login. Please try again.",
      }),
      { status: 500 }
    );
  }
}
