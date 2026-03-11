import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    // Check if an admin already exists to prevent duplicate creation
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Default admin already exists", email: "admin@admin.com" },
        { status: 200 }
      );
    }

    // Hash the default password ("admin123")
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create the default administrative user
    const adminUser = await User.create({
      name: "Global Admin",
      email: "admin@admin.com",
      password: hashedPassword,
      isAdmin: true,
      city: "San Francisco",
    });

    return NextResponse.json(
      {
        message: "Default admin created successfully",
        email: adminUser.email,
        password: "admin123", // Showing just once for the user
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create admin", error: error.message },
      { status: 500 }
    );
  }
}
