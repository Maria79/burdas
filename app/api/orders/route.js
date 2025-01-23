import connectDB from "@/config/database";
import Orders from "@/models/Orders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // Update with the path to your NextAuth options file

export const POST = async (req) => {
  await connectDB(); // Ensure MongoDB is connected

  try {
    // Fetch the user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      console.error("Session not found or invalid:", session);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { basket, paymentMethod, totalPrice } = await req.json(); // Parse the request body

    if (!basket || !paymentMethod) {
      console.error("Invalid payload:", { basket, paymentMethod });
      return new Response(
        JSON.stringify({ error: "Basket or payment method is missing" }),
        { status: 400 }
      );
    }

    // Create a new order document
    const newOrder = new Orders({
      userId: session.user.id, // User ID from the session
      basket,
      paymentMethod,
      totalPrice,
      status: {
        received: true, // Explicitly set the value for debugging
        inProgress: false, // Explicitly set the value for debugging
        readyToPick: false, // Explicitly set the value for debugging
        done: false, // Explicitly set the value for debugging
      },
    });

    // Save the order to the database
    await newOrder.save();

    return new Response(
      JSON.stringify({ message: "Order created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

//
export const GET = async () => {
  await connectDB();

  try {
    const orders = await Orders.find().populate("userId", "username email"); // Fetch all orders
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const PUT = async (req, { params }) => {
  await connectDB();

  try {
    const { id } = params; // Extract the order ID from the URL
    const { done } = await req.json(); // Extract the `done` value from the request body

    // Find and update the order
    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      { done },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Order updated successfully", updatedOrder }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
