import connectDB from "@/config/database";
import Admin from "@/models/Admin";
import bcrypt from "bcrypt";

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    return new Response(
      JSON.stringify({ message: "Admin registered successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering admin:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
