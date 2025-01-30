import Ventas from "@/components/manager/ventas/Ventas";
import connectDB from "@/config/database";
import Orders from "@/models/Orders";

export const fetchOrders = async () => {
  await connectDB();
  const orders = await Orders.find().populate("userId", "username email"); // Include username and email
  return JSON.parse(JSON.stringify(orders)); // Convert all fields, including populated ones
};

const ManagerPage = async () => {
  const orders = await fetchOrders();

  return (
    <>
      <div className="flex justify-between items-center px-2 mb-4">
        <h1 className="text-2xl font-bold">Manager Panel</h1>
      </div>
      <div className="px-2 md:px-4 pt-2 bg-white rounded-lg shadow-md">
        <Ventas orders={orders} />
      </div>
    </>
  );
};

export default ManagerPage;
