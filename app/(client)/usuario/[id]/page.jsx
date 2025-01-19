import connectDB from "@/config/database";
import Orders from "@/models/Orders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // Update with the correct path to your NextAuth configuration

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
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return (
      <div className="text-center mt-16">
        <h1 className="text-2xl font-semibold text-red-500">Unauthorized</h1>
        <p className="text-lg">You need to sign in to view your orders.</p>
      </div>
    );
  }

  const { id: userId } = params;

  if (userId !== session.user.id) {
    return (
      <div className="text-center mt-16">
        <h1 className="text-2xl font-semibold text-red-500">Access Denied</h1>
        <p className="text-lg">You cannot view orders for another user.</p>
      </div>
    );
  }

  const userOrders = await fetchOrders(userId);

  if (userOrders.length === 0) {
    return (
      <div className="text-center mt-16">
        <h1 className="text-2xl font-semibold">No Orders Found</h1>
        <p className="text-lg">You haven't placed any orders yet.</p>
      </div>
    );
  }

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
      .format(new Date(date))
      .replace(/\//g, "-");

  // Group orders by basket
  const groupOrdersByBasket = (orders) => {
    const groups = {};

    orders.forEach((order) => {
      // Create a unique identifier for the basket
      const basketKey = JSON.stringify(
        order.basket.map((item) => ({
          name: item.name,
          type: item.type,
          count: item.count,
          price: item.price,
        }))
      );

      if (!groups[basketKey]) {
        groups[basketKey] = [];
      }

      groups[basketKey].push(order);
    });

    // Convert groups to an array and sort by the newest order in each group
    return Object.values(groups).sort((a, b) => {
      const latestA = new Date(a[a.length - 1].createdAt);
      const latestB = new Date(b[b.length - 1].createdAt);
      return latestB - latestA; // Sort by descending date
    });
  };

  const groupedOrders = groupOrdersByBasket(userOrders);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Grouped Order History
      </h1>
      <div className="space-y-6">
        {groupedOrders.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="border border-gray-300 px-4 py-6 rounded-md shadow-md bg-white"
          >
            <div>
              <h2 className="font-semibold text-lg mb-2">Order Group:</h2>
              <div className="space-y-4">
                {group[0].basket.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md shadow-sm bg-gray-50"
                  >
                    <div className="capitalize font-medium text-gray-700">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="capitalize">{item.type}</span> x{" "}
                      <span className="font-semibold">{item.count}</span>
                    </div>
                    <div className="text-right text-gray-800 font-semibold">
                      €
                      {(
                        item.count * Number(item.price.replace(",", "."))
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Orders in this group:</h3>
              {group.map(({ _id, createdAt, totalPrice }) => (
                <div key={_id} className="mt-2">
                  <p className="text-sm">
                    Date: <span>{formatDate(createdAt)}</span>
                  </p>
                  {/* <p className="text-sm">
                    Total Price: <span>€{totalPrice}</span>
                  </p> */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
