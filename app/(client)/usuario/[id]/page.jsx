import connectDB from "@/config/database";
import Orders from "@/models/Orders";

// Fetch orders for a specific user by userId
export const fetchOrders = async (idParams) => {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all orders for the given userId
    const orders = await Orders.find({ userId: idParams });

    // Convert the result to JSON-friendly format
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // Return an empty array in case of an error
  }
};

const UserPage = async ({ params }) => {
  const userId = params.id; // Extract the userId from the route parameters

  // Fetch orders for the given userId
  const userOrders = await fetchOrders(userId);

  // Log the fetched orders (for debugging purposes)
  console.log(userOrders);

  return <div>{userOrders.length}</div>;
};

export default UserPage;
