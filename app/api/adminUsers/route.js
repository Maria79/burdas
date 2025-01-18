import connectDB from "@/config/database";
import UserAdmin from "@/models/UserAdmin";
import bcrypt from "bcrypt";

export const GET = async () => {
  await connectDB(); // Ensure MongoDB is connected
  try {
    const users = await UserAdmin.find({}, { password: 0 }); // Exclude passwords
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const POST = async (req) => {
  await connectDB(); // Ensure MongoDB is connected
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Missing username or password" }),
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = new UserAdmin({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return new Response(
      JSON.stringify({ message: "Admin user created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
