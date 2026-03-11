import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

const mockProducts = [
  {
    name: "Adidas CoreFit T-Shirt",
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 39.9,
    sizes: ["s", "m", "l", "xl", "xxl"],
    colors: ["gray", "purple", "green"],
    images: {
      gray: "/products/1g.png",
      purple: "/products/1p.png",
      green: "/products/1gr.png",
    },
  },
  {
    name: "Puma Ultra Warm Zip",
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 59.9,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green"],
    images: { gray: "/products/2g.png", green: "/products/2gr.png" },
  },
  {
    name: "Nike Air Essentials Pullover",
    shortDescription: "Lorem ipsum.",
    description: "Lorem ipsum dolor sit amet.",
    price: 69.9,
    sizes: ["s", "m", "l"],
    colors: ["green", "blue", "black"],
    images: { green: "/products/3gr.png", blue: "/products/3b.png", black: "/products/3bl.png" },
  },
  {
    name: "Nike Dri Flex T-Shirt",
    shortDescription: "Lorem ipsum dolor .",
    description: "Lorem ipsum dolor sit.",
    price: 29.9,
    sizes: ["s", "m", "l"],
    colors: ["white", "pink"],
    images: { white: "/products/4w.png", pink: "/products/4p.png" },
  },
  {
    name: "Under Armour StormFleece",
    shortDescription: "Lorem ipsum.",
    description: "Lorem.",
    price: 49.9,
    sizes: ["s", "m", "l"],
    colors: ["red", "orange", "black"],
    images: { red: "/products/5r.png", orange: "/products/5o.png", black: "/products/5bl.png" },
  },
  {
    name: "Nike Air Max 270",
    shortDescription: "Great shoes.",
    description: "Very great shoes.",
    price: 59.9,
    sizes: ["40", "42", "43", "44"],
    colors: ["gray", "white"],
    images: { gray: "/products/6g.png", white: "/products/6w.png" },
  },
  {
    name: "Nike Ultraboost Pulse",
    shortDescription: "Running shoes.",
    description: "Perfect for running.",
    price: 69.9,
    sizes: ["40", "42", "43"],
    colors: ["gray", "pink"],
    images: { gray: "/products/7g.png", pink: "/products/7p.png" },
  },
  {
    name: "Levi’s Classic Denim",
    shortDescription: "Classic jeans.",
    description: "Levi's original fit.",
    price: 59.9,
    sizes: ["s", "m", "l"],
    colors: ["blue", "green"],
    images: { blue: "/products/8b.png", green: "/products/8gr.png" },
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    await Product.deleteMany(); // Clear existing
    await Product.insertMany(mockProducts);
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Seed failed", error: error.message }, { status: 500 });
  }
}
