import connectDB from "@/Database/config";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
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
    if (user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User already exists. Please sign in.",
        }),
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
    });
    const token = await newUser.generateAuthToken();
    const response =  new NextResponse(
      JSON.stringify({
        success: true,
        message: "Account created successfully. Please sign in.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
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
        message: "Failed to create account. Please try again.",
      }),
      { status: 500 }
    );
  }
}
