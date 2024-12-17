import connectDB from "@/config/database";
import Orders from "@/models/Orders";

export const PUT = async (req, { params }) => {
  await connectDB(); // Ensure MongoDB connection

  try {
    const { id } = params; // Extract the order ID from the URL
    const { status } = await req.json(); // Extract the `status` object from the request body

    console.log("Request to update order status:", { id, status });

    // Validate that `status` contains at least one valid field to update
    const allowedStatusFields = [
      "received",
      "inProgress",
      "readyToPick",
      "done",
    ];
    const updateFields = {};

    for (const key in status) {
      if (allowedStatusFields.includes(key)) {
        updateFields[`status.${key}`] = status[key]; // Target nested fields in `status`
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        {
          status: 400,
        }
      );
    }

    // Update the order using Mongoose's $set operator
    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Update nested `status` fields
      { new: true } // Return the updated order document
    );

    if (!updatedOrder) {
      console.log("Order not found");
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    console.log("Updated Order:", updatedOrder);

    return new Response(
      JSON.stringify({
        message: "Order status updated successfully",
        updatedOrder,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
