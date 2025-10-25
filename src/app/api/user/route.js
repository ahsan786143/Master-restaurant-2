import connectToDatabase from "@/app/lib/db";
import UserSignUp from "@/app/models/UserSignUp";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use env var in production

// ---------------- SIGNUP ----------------
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, email, password, confirmPassword, city, phone } = body || {};

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const existingEmail = await UserSignUp.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const existingPhone = await UserSignUp.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserSignUp.create({
      name,
      email,
      password: hashedPassword,
      city,
      phone,
    });

    const safeUser = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      city: newUser.city,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------- LOGIN ----------------
export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await UserSignUp.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      phone: user.phone,
      createdAt: user.createdAt,
      token,
    };

    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------- GET USERS ----------------
export async function GET() {
  try {
    await connectToDatabase();

    const users = await UserSignUp.find().select("-password").limit(100);

    return NextResponse.json(
      {
        success: true,
        totalUsers: users.length,
        users,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Get users error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
