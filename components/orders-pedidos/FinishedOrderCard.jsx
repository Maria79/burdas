import BasketOrder from "./BasketOrder";
import TimeCounter from "./TimerCounter";

const FinishedOrderCard = ({
  order,
  backgroundColor,
  removeOrder,
  username,
}) => {
  const handleFinishedOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: { readyToPick: false, done: true } }), // Update the inProgress field
      });

      if (response.ok) {
        console.log("Order marked as In Progress successfully!");
        removeOrder(order._id); // Remove the order from the UI
      } else {
        console.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div
      className={`px-8 py-8 border border-[#760e0d] rounded-md shadow-sm ${backgroundColor}`}
    >
      <div>
        <button
          onClick={handleFinishedOrder}
          className="border border-gray-300 px-4 py-2 rounded-md bg-slate-500 text-white shadow-md hover:bg-slate-400 hover:text-black"
        >
          Entregado
        </button>
      </div>
      <div className="flex justify-end">
        <TimeCounter createdAt={order.createdAt} />
      </div>
      <div>
        <div className="mb-2">
          Cliente: <span className="text-sm font-semibold">{username}</span>
        </div>
        <div className="mb-2">
          Ordered:{" "}
          <span className="text-sm font-semibold">
            {new Date(order.createdAt).toLocaleTimeString("en-GB")}
          </span>
        </div>
        <div className="mb-2">
          <div className="flex justify-between">
            <div>
              Pago:{" "}
              <span className="font-semibold mr-6">
                {order.paymentMethod === "onStore"
                  ? "En tienda"
                  : "Con tarjeta"}
              </span>
            </div>
            <div>
              Total:{" "}
              <span className="font-semibold text-lg">{order.totalPrice}</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {order.basket.map((item, index) => (
            <BasketOrder order={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinishedOrderCard;
