import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Database/config";
import { isUserAuthenticated } from "@/lib/auth";

await connectDB();

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching user data",request.cookies.get("token")?.value); 
    const user = await isUserAuthenticated(request);
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { success: false, 
          message: "User not found" 
        },
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
    },{status: 200});
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
