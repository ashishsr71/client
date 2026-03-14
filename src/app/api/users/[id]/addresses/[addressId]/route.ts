import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; addressId: string }> }
) {
  try {
    const { id, addressId } = await params;
    await connectToDatabase();
    const body = await req.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    if (body.isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    Object.assign(address, body);
    await user.save();

    return NextResponse.json({ addresses: user.addresses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update address", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; addressId: string }> }
) {
  try {
    const { id, addressId } = await params;
    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.addresses.pull(addressId);
    await user.save();

    return NextResponse.json({ addresses: user.addresses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete address", error: error.message },
      { status: 500 }
    );
  }
}
