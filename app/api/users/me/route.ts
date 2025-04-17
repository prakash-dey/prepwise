import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Database/config";
import { isUserAuthenticated } from "@/lib/auth";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAuthenticated(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      mesaaage: "User found",
      data: {
        name: user?.name,
        email: user?.email,
        _id: user?._id,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
