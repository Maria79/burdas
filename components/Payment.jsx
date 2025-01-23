"use client";

import { useBasket } from "@/context/BasketContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Payment = () => {
  const [selectedOption, setSelectedOption] = useState("onStore");
  const { basket, clearBasket } = useBasket();
  const router = useRouter();

  // Calculate total price
  const calculateTotalPrice = () => {
    return basket.reduce((total, item) => {
      const priceToUse = item.updatedPrice
        ? Number(item.updatedPrice)
        : Number(item.price.replace(",", "."));
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
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basket,
          paymentMethod: selectedOption,
          totalPrice,
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
    return currentHour >= 18 && currentHour < 23; // Between 18:00 and 23:00
  };

  // Handle cancel action
  const handleCancel = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-100 mt-16 rounded-lg shadow-md">
      <form className="py-8 px-8 space-y-6">
        {/* Basket Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
            Pedido
          </h3>
          {basket.map((item) => (
            <div key={item._id}>
              <div className="flex justify-between items-center text-sm mb-0.5">
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
                        ? Number(item.updatedPrice)
                        : Number(item.price.replace(",", ".")))
                  )}
                </span>
              </div>
              {/* Extras Info */}
              {item.extras && item.extras.length > 0 && (
                <div className="mb-2 pl-4 text-xs text-gray-600">
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

        {/* Credit Card Details */}
        {selectedOption === "creditCard" && (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="nameCard"
                className="text-sm font-medium text-gray-700"
              >
                Nombre en tarjeta
              </label>
              <input
                className="p-2 border border-gray-300 rounded-md"
                type="text"
                id="nameCard"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="cardNumber"
                className="text-sm font-medium text-gray-700"
              >
                Número de tarjeta
              </label>
              <input
                className="p-2 border border-gray-300 rounded-md"
                type="number"
                id="cardNumber"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Fecha de expiración
                </label>
                <input
                  className="p-2 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="MM / YY"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Código de seguridad
                </label>
                <input
                  className="p-2 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="CVC"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="country"
                className="text-sm font-medium text-gray-700"
              >
                País
              </label>
              <input
                className="p-2 border border-gray-300 rounded-md"
                type="text"
                id="country"
              />
            </div>
          </div>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2 text-lg font-medium rounded-md shadow-md bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSendOrder}
            className={`px-8 py-2 text-lg font-medium rounded-md shadow-md transition-all ${
              isWithinActiveHours()
                ? "bg-green-500 text-white hover:bg-green-400"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isWithinActiveHours()}
          >
            {selectedOption === "onStore" ? "Enviar" : "Pagar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
