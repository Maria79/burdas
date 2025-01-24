"use client";

import { useBasket } from "@/context/BasketContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { extrasList } from "@/utils/extras";

const Payment = () => {
  const [selectedOption, setSelectedOption] = useState("onStore");
  const { basket, clearBasket } = useBasket();
  const router = useRouter();

  // Calculate total price
  const calculateTotalPrice = () => {
    return basket.reduce((total, item) => {
      const priceToUse = item.updatedPrice
        ? parseFloat(item.updatedPrice)
        : parseFloat(item.price.replace(",", "."));
      const itemTotal = item.count ? item.count * priceToUse : 0;
      return total + itemTotal;
    }, 0);
  };

  const totalPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(calculateTotalPrice());

  // Handle order submission
  const handleSendOrder = async () => {
    const structuredBasket = basket.map((item) => ({
      ...item,
      extras: (item.extras || []).map((extraName) => {
        return { name: extraName }; // Map extras to an array of objects with `name`
      }),
    }));

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basket: structuredBasket,
          paymentMethod: selectedOption,
          totalPrice: calculateTotalPrice().toFixed(2),
        }),
      });

      if (response.ok) {
        console.log("Order submitted successfully!");
        clearBasket(); // Clear basket
        router.push("/menu/entrantes"); // Navigate to a menu page
      } else {
        const error = await response.json();
        console.error("Error submitting order:", error);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const isWithinActiveHours = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 18 && currentHour < 24; // Between 18:00 and 24:00
  };

  const handleCancel = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white mt-16 rounded-lg shadow-md border border-gray-200">
      <form className="py-8 px-8 space-y-6">
        {/* Basket Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
            Pedido
          </h3>
          {basket.map((item) => (
            <div key={item._id} className="mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="truncate">
                  - <span className="capitalize">{item.type}</span> _{" "}
                  <span className="capitalize font-medium">{item.name}</span>{" "}
                  {item.count > 1 && (
                    <span className="text-gray-600">x{item.count}</span>
                  )}
                </span>
                <span className="font-semibold text-gray-700">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(
                    item.count *
                      (item.updatedPrice
                        ? parseFloat(item.updatedPrice)
                        : parseFloat(item.price.replace(",", ".")))
                  )}
                </span>
              </div>
              {item.extras && item.extras.length > 0 && (
                <div className="mt-2 pl-4 text-sm text-gray-600">
                  <p className="font-light text-gray-700">
                    Extras:{" "}
                    <span>
                      {item.extras.map((extraName, index) => (
                        <span key={index} className="italic">
                          {extraName}
                          {index < item.extras.length - 1 && ", "}
                        </span>
                      ))}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
          <hr className="border-gray-300 my-4" />
          <div className="text-right font-semibold text-lg">
            Total: {totalPrice}
          </div>
        </div>

        <p className="text-xs text-gray-500 italic">
          * Solo se procesarán los pedidos recibidos dentro del horario de
          apertura del establecimiento.
        </p>

        {/* Payment Options */}
        <div className="my-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Método de pago
          </h3>
          <div className="flex justify-between items-center space-x-4">
            {["onStore", "creditCard"].map((option) => (
              <label
                key={option}
                htmlFor={option}
                className={`flex items-center space-x-2 cursor-pointer ${
                  option === "creditCard" ? "text-gray-400" : "text-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  id={option}
                  checked={selectedOption === option}
                  disabled={option === "creditCard"}
                  onChange={() => setSelectedOption(option)}
                  className="accent-[#760e0d]"
                />
                <span>
                  {option === "onStore" ? "Al recoger" : "Con tarjeta"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between space-x-4 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 text-lg font-medium rounded-md shadow-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSendOrder}
            className={`px-6 py-2 text-lg font-medium rounded-md shadow-md transition-all ${
              isWithinActiveHours()
                ? "bg-green-500 text-white hover:bg-green-400"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            // disabled={!isWithinActiveHours()}
          >
            {selectedOption === "onStore" ? "Enviar" : "Pagar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
