"use client";

import { useBasket } from "@/context/BasketContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Payment = () => {
  const [selectedOption, setSelectedOption] = useState("onStore");
  const { basket, clearBasket } = useBasket();
  const router = useRouter();

  // Calculate the total price of the basket
  const totalPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(
    basket.reduce((total, item) => {
      const itemTotal =
        item.count && item.price
          ? item.count * Number(item.price.replace(",", "."))
          : 0;
      return total + itemTotal;
    }, 0) // Initial total is 0
  );

  const handleCheckboxChange = (option) => {
    setSelectedOption((prevOption) => (prevOption === option ? "" : option));
  };

  const handleSendOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          basket,
          paymentMethod: selectedOption,
          totalPrice,
        }),
      });

      if (response.ok) {
        console.log("Order submitted successfully!");
        clearBasket(); // Clear the basket after successful order

        console.log("Redirecting to home...");
        router.push("/menu/entrantes"); // Navigate to the home page
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
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Pedido:</h3>
          <div>
            {basket.map((item) => (
              <div key={item._id} className="px-2 mb-2">
                <div className="flex">
                  <p className="w-full text-nowrap text-sm">
                    - <span className="capitalize">{item.type}</span> _{" "}
                    <span className="font-semibold capitalize truncate inline-flex max-w-[170px]">
                      {item.name}
                    </span>{" "}
                    <span>{`${item.count > 1 ? `x ${item.count}` : ""}`}</span>
                  </p>
                  <div className="text-sm">
                    {item.count && item.price
                      ? new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        }).format(
                          item.count * Number(item.price.replace(",", "."))
                        )
                      : "€0.00"}
                  </div>
                </div>
              </div>
            ))}
            <hr className="border border-red-700" />
            <div className="px-2 mt-2 text-right font-semibold">
              Total: {totalPrice}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="">
            <input
              className="mr-4"
              type="checkbox"
              name="onStore"
              id="onStore"
              checked={selectedOption === "onStore"}
              onChange={() => handleCheckboxChange("onStore")}
            />
            <label htmlFor="onStore">Al recoger</label>
          </div>
          <div className="">
            <input
              className="mr-4"
              type="checkbox"
              name="creditCard"
              id="creditCard"
              checked={selectedOption === "creditCard"}
              onChange={() => handleCheckboxChange("creditCard")}
            />
            <label htmlFor="creditCard">Con tarjeta</label>
          </div>
        </div>
        {selectedOption === "creditCard" && (
          <div className="pt-8">
            <div className="flex flex-col  mb-4">
              <label htmlFor="nameCard" className="mb-2">
                Nombre en tarjeta
              </label>
              <input
                className="p-2"
                type="text"
                name="nameCard"
                id="nameCard"
                maxLength={16}
                minLength={16}
              />
            </div>
            <div className="flex flex-col  mb-4">
              <label htmlFor="cardNumber" className="mb-2">
                Número de tarjeta
              </label>
              <input
                className="p-2"
                type="number"
                name="cardNumber"
                id="cardNumber"
                maxLength={16}
                minLength={16}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <div className="flex flex-col">
                <label htmlFor="" className="mb-2">
                  Fecha de expiración
                </label>
                <input
                  className="p-2"
                  type="text"
                  name=""
                  id=""
                  placeholder="MM / YY"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="mb-2">
                  Código de seguridad
                </label>
                <input
                  className="p-2"
                  type="text"
                  name=""
                  id=""
                  placeholder="CVC"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="mb-2">
                País
              </label>
              <input className="p-2" type="text" name="country" id="country" />
            </div>
            <div className="text-center py-8">
              <button
                type="button"
                onClick={handleSendOrder}
                className="px-8 py-2 bg-green-500 rounded-md text-white shadow-md "
              >
                Pagar
              </button>
            </div>
          </div>
        )}
        {selectedOption === "onStore" && (
          <div className="text-center pt-8">
            <button
              type="button"
              onClick={handleSendOrder}
              className="px-8 py-2 bg-green-500 rounded-md text-white shadow-md "
            >
              Enviar
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Payment;
