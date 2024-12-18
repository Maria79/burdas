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
      const itemTotal =
        item.count && item.price
          ? item.count * Number(item.price.replace(",", "."))
          : 0;
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

  return (
    <div className="w-[360px] md:w-[475px] bg-[#e3e2e2] mt-16 rounded-lg">
      <form className="py-8 px-8">
        {/* Basket Details */}
        <div className="mb-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Pedido:</h3>
          </div>
          {basket.map((item) => (
            <div key={item._id} className="flex justify-between text-sm mb-2">
              <span>
                - <span className="capitalize">{item.type}</span> _{" "}
                <span className="capitalize">{item.name}</span>{" "}
                {item.count > 1 ? `x${item.count}` : ""}
              </span>
              <span>
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(item.count * Number(item.price.replace(",", ".")))}
              </span>
            </div>
          ))}
          <hr className="border border-red-700" />
          <div className="text-right font-semibold mt-2">
            Total: {totalPrice}
          </div>
        </div>

        {/* Payment Options */}
        <div className="flex justify-between my-8">
          {["onStore", "creditCard"].map((option) => (
            <div key={option}>
              <input
                className="mr-4"
                type="radio"
                name="paymentMethod"
                id={option}
                checked={selectedOption === option}
                disabled={option === "creditCard"} // Disable "Con tarjeta"
                onChange={() => setSelectedOption(option)}
              />
              <label
                htmlFor={option}
                className={`${option === "creditCard" ? "text-gray-400" : ""}`}
              >
                {option === "onStore" ? "Al recoger" : "Con tarjeta"}
              </label>
            </div>
          ))}
        </div>

        {/* Credit Card Details */}
        {selectedOption === "creditCard" && (
          <div>
            <div className="flex flex-col mb-4">
              <label htmlFor="nameCard" className="mb-2">
                Nombre en tarjeta
              </label>
              <input className="p-2" type="text" id="nameCard" />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="cardNumber" className="mb-2">
                Número de tarjeta
              </label>
              <input className="p-2" type="number" id="cardNumber" />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="mb-2">Fecha de expiración</label>
                <input className="p-2" type="text" placeholder="MM / YY" />
              </div>
              <div>
                <label className="mb-2">Código de seguridad</label>
                <input className="p-2" type="text" placeholder="CVC" />
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="country" className="mb-2">
                País
              </label>
              <input className="p-2" type="text" id="country" />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center my-4">
          <button
            type="button"
            onClick={handleSendOrder}
            className="px-8 py-2 bg-green-500 rounded-md text-white shadow-md"
          >
            {selectedOption === "onStore" ? "Enviar" : "Pagar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
