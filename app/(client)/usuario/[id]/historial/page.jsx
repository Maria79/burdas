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

const UserHistory = async ({ params }) => {
  // Check user session
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You need to sign in to view your orders.</p>
      </div>
    );
  }

  const userId = params.id; // Extract the userId from the route parameters

  // Ensure the logged-in user's ID matches the requested userId
  if (userId !== session.user.id) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You cannot view orders for another user.</p>
      </div>
    );
  }

  // Fetch orders for the given userId
  const userOrders = await fetchOrders(userId);

  if (!userOrders || userOrders.length === 0) {
    return <div>No ha realizado ningún pedido aún.</div>;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div>
      <h1>{userOrders.length > 1 ? "Más de un pedido." : "Un pedido."}</h1>
      <div className="w-fit px-2 py-4">
        {userOrders.map(({ _id, createdAt, basket, totalPrice }) => (
          <div
            key={_id}
            className="border border-zinc-400 px-2 py-4 mb-2 rounded-md shadow-md"
          >
            <div className="text-right">
              Fecha:{" "}
              <span>
                {formatter.format(new Date(createdAt)).replace(/\//g, "-")}
              </span>
            </div>
            <div>
              Pedidos:
              {basket.map(({ type, name, count }, index) => (
                <div key={index} className="mt-1">
                  - <span className="capitalize">{type}</span> -{" "}
                  <span className="font-semibold capitalize">{name}</span> x{" "}
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              Precio Total: <span className="font-semibold">{totalPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
