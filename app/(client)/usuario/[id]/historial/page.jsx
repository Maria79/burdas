import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import connectDB from "@/config/database";
import Orders from "@/models/Orders";
import BasketWrapper from "@/components/BasketWrapper";

export const fetchOrders = async (idParams) => {
  try {
    await connectDB();
    const orders = await Orders.find({ userId: idParams });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
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

  return <BasketWrapper userOrders={userOrders} />;
};

export default UserPage;
