import connectDB from "@/Database/config";
import Interview from "@/models/Interview.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function GET( request : NextRequest,{ params } : RouteParams) {
    const { userId } = await params;
    const interviews = await Interview.find({userId});
    if (!interviews) {
        return NextResponse.json({ success: false, message: "Interviews not found" },{ status: 404 });
    }
   
    return NextResponse.json({ success: true, data: interviews },{ status: 200 });
}