import connectDB from "@/config/database";
import Orders from "@/models/Orders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // Update with the correct path to your NextAuth configuration

// Fetch orders for a specific user by userId
export const fetchOrders = async (idParams) => {
  try {
    await connectDB(); // Connect to the database
    const orders = await Orders.find({ userId: idParams }).sort({
      // Fetch all orders for the given userId
      createdAt: -1,
    });
    return JSON.parse(JSON.stringify(orders)); // Convert the result to JSON-friendly format
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // Return an empty array in case of an error
  }
};

const getStatusLabel = (status) => {
  if (status.done) return "Entregado";
  if (status.readyToPick) return "Listo para recoger";
  if (status.inProgress) return "En preparación";
  if (status.received) return "Recibido";
  return "Desconocido";
};

const UserPage = async ({ params }) => {
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

  // Filter out orders with status.done = true
  const filteredOrders = userOrders.filter((order) => !order.status.done);
  // console.log(filteredOrders);

  return (
    <div className="py-8 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Rastrea tu pedido
      </h1>
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center mt-20">
          <p className="text-lg text-gray-600">
            Actualmente no tienes pedidos para rastrear.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex flex-col space-y-4">
                <div className="font-medium text-gray-800">
                  Pedido #{order._id}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-md font-medium">
                    <strong>Estado:</strong>{" "}
                  </p>
                  <div
                    className={`mx-auto px-3 py-2 text-sm font-semibold rounded-md ${
                      order.status.received
                        ? "bg-blue-100 text-blue-800"
                        : order.status.inProgress
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status.readyToPick
                        ? "bg-green-100 text-green-800"
                        : ""
                    }`}
                  >
                    {order.status.received
                      ? "Recibido"
                      : order.status.inProgress
                      ? "En Progreso"
                      : order.status.readyToPick
                      ? "Listo para Recoger"
                      : ""}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700">
                  <strong>Total:</strong>{" "}
                  <span className="font-medium text-gray-900">
                    €{order.totalPrice}
                  </span>
                </p>
                <p className="text-gray-500">
                  <strong>Pago:</strong>{" "}
                  {order.paymentMethod === "onStore"
                    ? "En establecimiento"
                    : order.paymentMethod}
                </p>
                <p className="text-gray-500">
                  <strong>Fecha:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
