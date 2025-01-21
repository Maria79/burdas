import connectDB from "@/config/database";
import Admin from "@/models/Admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ADMIN_JWT_SECRET; // Add this to your environment variables

export const POST = async (req) => {
  await connectDB();
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        {
          status: 401,
        }
      );
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        {
          status: 401,
        }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      SECRET_KEY,
      {
        expiresIn: "1d", // Token valid for 1 day
      }
    );

    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
