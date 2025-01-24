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

    // Validate payload
    if (!basket || !paymentMethod) {
      console.error("Invalid payload:", { basket, paymentMethod });
      return new Response(
        JSON.stringify({ error: "Basket or payment method is missing" }),
        { status: 400 }
      );
    }

    // Validate and sanitize the basket
    const extrasList = [
      { name: "Queso Asado", price: 2.0 },
      { name: "Queso Cheddar", price: 1.2 },
      { name: "Aguacate", price: 1.5 },
      { name: "Plátano Frito", price: 1.5 },
      { name: "Bacón", price: 1.2 },
      { name: "Pollo Crispy", price: 2.0 },
      { name: "Ensalada de Col Dulce", price: 1.6 },
      { name: "Postres", price: 1.6 },
    ];

    const sanitizedBasket = basket.map((item) => {
      if (!item._id || !item.name || !item.type || !item.price || !item.count) {
        throw new Error(`Invalid basket item: ${JSON.stringify(item)}`);
      }

      const sanitizedExtras = (item.extras || []).map((extraName) => {
        const extra = extrasList.find((e) => e.name === extraName);
        if (!extra) {
          throw new Error(`Invalid extra in basket item: "${extraName}"`);
        }
        return { name: extra.name, price: extra.price };
      });

      return {
        _id: item._id,
        name: item.name,
        type: item.type,
        count: item.count,
        price: parseFloat(item.price.replace(",", ".")),
        extras: sanitizedExtras,
      };
    });

    // Create a new order document
    const newOrder = new Orders({
      userId: session.user.id,
      basket: sanitizedBasket,
      paymentMethod,
      totalPrice: parseFloat(totalPrice),
      status: {
        received: true,
        inProgress: false,
        readyToPick: false,
        done: false,
      },
    });

    // Save the order to the database
    await newOrder.save();

    return new Response(
      JSON.stringify({ message: "Order created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error.message || error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
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
