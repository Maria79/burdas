import FinishedOrdersCards from "@/components/orders-pedidos/FinishedOrdersCards";
import connectDB from "@/config/database";
import Orders from "@/models/Orders";

export const fetchOrders = async () => {
  await connectDB();
  const orders = await Orders.find().populate("userId", "username email"); // Include username and email
  return JSON.parse(JSON.stringify(orders)); // Convert all fields, including populated ones
};

const FinishedOrdersPage = async () => {
  const orders = await fetchOrders();

  // Filter orders before passing them to components
  const finishedOrders = orders.filter((order) => order.status.readyToPick);

  return (
    <>
      <div className="px-4 pt-16">
        {/* <h1 className="text-2xl font-bold">Pedidos:</h1> */}

        <div className="">
          <h2 className="text-2xl font-semibold">Pedidos terminados:</h2>
          <FinishedOrdersCards initialOrders={finishedOrders} />
        </div>
      </div>
    </>
  );
};

export default FinishedOrdersPage;
