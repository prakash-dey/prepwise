import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User.model";
import connectDB from "@/Database/config";
import { cookies } from "next/headers";
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



