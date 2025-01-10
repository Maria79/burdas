import connectDB from "@/config/database";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign in
    async signIn({ user, account, profile }) {
      try {
        // Connect to the database
        await connectDB();

        // Check if user already exists in the database
        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          // If user does not exist, create a new one
          await User.create({
            email: profile.email,
            username: profile.name.slice(0, 20), // Limit username to 20 characters
            image: profile.picture, // Google profile picture
          });
        }

        return true; // Allow sign in
      } catch (error) {
        console.error("Error during sign in:", error);
        return false; // Deny sign in on error
      }
    },
    async session({ session }) {
      try {
        await connectDB();

        // Attach user ID to session
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
        } else {
          console.warn(`User not found for email: ${session.user.email}`);
        }

        return session;
      } catch (error) {
        console.error("Error during session callback:", error);
        throw new Error("Session retrieval failed");
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment variables
};

export default authOptions;
