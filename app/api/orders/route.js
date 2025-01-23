import connectDB from "@/config/database";
import Orders from "@/models/Orders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // Update with the path to your NextAuth options file

export const POST = async (req) => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { basket, paymentMethod, totalPrice } = await req.json();

    if (!basket || !Array.isArray(basket) || basket.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing basket" }),
        { status: 400 }
      );
    }

    // Validate each basket item
    for (const item of basket) {
      if (!item._id || !item.name || !item.type || !item.price || !item.count) {
        return new Response(
          JSON.stringify({
            error: `Invalid basket item: ${JSON.stringify(item)}`,
          }),
          { status: 400 }
        );
      }
      if (item.extras) {
        for (const extra of item.extras) {
          if (!extra.name || !extra.price) {
            return new Response(
              JSON.stringify({
                error: `Invalid extra in basket item: ${JSON.stringify(extra)}`,
              }),
              { status: 400 }
            );
          }
        }
      }
    }

    const newOrder = new Orders({
      userId: session.user.id,
      basket,
      paymentMethod,
      totalPrice,
      status: {
        received: true,
        inProgress: false,
        readyToPick: false,
        done: false,
      },
    });

    const savedOrder = await newOrder.save();

    return new Response(
      JSON.stringify({
        message: "Order created successfully",
        order: savedOrder,
      }),
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
