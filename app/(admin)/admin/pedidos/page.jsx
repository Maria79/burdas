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
        <h1 className="text-2xl font-bold">Pedidos:</h1>
        <div className="flex gap-2">
          <div className="border-r pr-2 w-1/2">
            <h2>Pedidos recibidos</h2>
            <OrdersCards initialOrders={receivedOrders} />
          </div>
          <div className="border-l pl-2 w-1/2">
            <h2>Pedidos en curso</h2>
            <InProgressCards initialOrders={inProgressOrders} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PedidosPage;
