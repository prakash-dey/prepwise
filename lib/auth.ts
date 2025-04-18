import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User.model";
import connectDB from "@/Database/config";
import { cookies } from "next/headers";
import Interview from "@/models/Interview.model";
await connectDB();
 
export const isUserAuthenticated = async () => {
    try {
        const _cookies = await cookies();
        const token = _cookies.get("token")?.value || '';
        console.log("User Token:", token);
        if (!token) {
            return null;
        }
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (!decodedToken) {
            return null;
        }
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return null;
        }
        return user;
    } catch (error: any) {
        return null;
    }
}

export const getInterviewById = async (id: string) => {
    try {
        const interview = await Interview.findById(id);
        if (!interview) {
            return null;
        }
        return interview;
    } catch (error: any) {
        console.error("Error fetching interview:", error);
        return null;
    }
}

export const getFeedbackByInterviewId = async (params:{interviewId: string, userId:string}) => {
    try {
        const { interviewId, userId } = params;
        const feedback = await Interview.findOne({
            _id: interviewId,
            userId: userId,
        });
        if (!feedback) {
            return null;
        }
        return feedback;
    } catch (error: any) {
        console.error("Error fetching feedback:", error);
        return null;
    }
}