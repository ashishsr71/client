import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    // Attempting to resolve error with mongoose queries getting cached sometimes
    const user = await User.findById(id).select("-password").lean().exec();
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const data = await req.json();
    
    // Only allow updating specific fields
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.bio !== undefined) updateData.bio = data.bio;
    // Note: Password resets should not be done here for security (hashing needed)

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update user profile", error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
