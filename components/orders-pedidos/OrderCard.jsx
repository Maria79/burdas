import BasketOrder from "./BasketOrder";
import TimeCounter from "./TimerCounter";

const OrderCard = ({ order, backgroundColor, removeOrder, username }) => {
  const handleInProgress = async () => {
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: { received: false, inProgress: true } }), // Update the inProgress field
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
          onClick={handleInProgress}
          className="border border-gray-300 px-4 py-2 rounded-md bg-slate-500 text-white shadow-md hover:bg-slate-400 hover:text-black"
        >
          In Process
        </button>
      </div>
      <div className="flex justify-end">
        <TimeCounter createdAt={order.createdAt} />
      </div>
      <div>
        <div>
          Ordered:{" "}
          <span className="text-sm font-semibold">
            {new Date(order.createdAt).toLocaleTimeString("en-GB")}
          </span>
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

export default OrderCard;
