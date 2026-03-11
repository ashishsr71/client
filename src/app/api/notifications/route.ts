import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Fetch user's notifications, newest first, max 50
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
      
    return NextResponse.json(notifications, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, markAllRead } = body;

    if (!userId || !markAllRead) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Mark all unread notifications for this user as read
    const result = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json(
      { message: "Notifications marked as read", updatedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
