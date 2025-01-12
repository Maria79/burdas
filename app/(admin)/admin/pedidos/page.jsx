import InProgressCards from "@/components/orders-pedidos/InProgressCards";
import OrdersCards from "@/components/orders-pedidos/OrdersCards";
import connectDB from "@/config/database";
import Orders from "@/models/Orders";

export const fetchOrders = async () => {
  await connectDB();
  const orders = await Orders.find().populate("userId", "username email"); // Include username and email
  return JSON.parse(JSON.stringify(orders)); // Convert all fields, including populated ones
};

const PedidosPage = async () => {
  const orders = await fetchOrders();

  // Filter orders before passing them to components
  const receivedOrders = orders.filter(
    (order) => order.status.received && !order.status.inProgress
  );

  const inProgressOrders = orders.filter(
    (order) => order.status.inProgress && !order.status.done
  );

  return (
    <>
      <div className="px-4 pt-16">
        {/* <h1 className="text-2xl font-bold mb-4">Pedidos:</h1> */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:border-r md:pr-2 md:w-1/2">
            <h2 className="text-2xl font-semibold">Pedidos recibidos:</h2>
            <OrdersCards initialOrders={receivedOrders} />
          </div>
          <div className="w-full md:border-l md:pl-2 md:w-1/2">
            <h2 className="text-2xl font-semibold">Pedidos en curso:</h2>
            <InProgressCards initialOrders={inProgressOrders} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PedidosPage;
