import BasketOrder from "./BasketOrder";
import TimeCounter from "./TimerCounter";

const InProgressCard = ({ order, backgroundColor, removeOrder, username }) => {
  const handleReadyToPick = async () => {
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: { inProgress: false, readyToPick: true },
        }), // Update done to true
      });

      if (response.ok) {
        console.log("Order updated successfully!");
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
          onClick={handleReadyToPick}
          className="border border-gray-300 px-4 py-2 rounded-md bg-slate-500 text-white shadow-md hover:bg-slate-400 hover:text-black"
        >
          Terminado
        </button>
      </div>
      <div className="flex justify-end">
        <TimeCounter createdAt={order.createdAt} />
      </div>
      <div>
        <div>
          Cliente: <span className="text-sm font-semibold">{username}</span>
        </div>
        <div>
          Ordered:{" "}
          <span className="text-sm font-semibold">
            {new Date(order.createdAt).toLocaleTimeString("en-GB")}
          </span>
        </div>
        <div>
          <p>
            Pago:{" "}
            <span className="font-semibold mr-6">
              {order.paymentMethod === "onStore" ? "En tienda" : "Con tarjeta"}
            </span>
            Total: <span className="font-semibold">{order.totalPrice}</span>
          </p>
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

export default InProgressCard;
