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

        const userEmail = profile.email;
        if (!userEmail) {
          console.error("No email found in Google profile.");
          return false; // Deny sign in
        }

        // Check if user already exists in the database
        // Check if user exists, otherwise create a new one
        let userExists = await User.findOneAndUpdate(
          { email: userEmail },
          { lastLogin: new Date() }, // Update last login timestamp
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!userExists.username) {
          // Assign a sanitized username if missing
          userExists.username =
            profile.name?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20) || "User";
          await userExists.save();
        }

        return true; // Allow sign in
      } catch (error) {
        console.error("Error during sign in:", error);
        return false; // Deny sign in on error
      }
    },
    /**
     * Runs when a session is created.
     * Attaches the MongoDB user ID to the session.
     */
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
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
};

export default authOptions;
