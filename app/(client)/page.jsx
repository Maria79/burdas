"use client";

import Link from "next/link";
import Image from "next/image";

const combos = [
  {
    id: 1,
    name: "Combo Deluxe",
    description:
      "Disfruta de nuestros productos más vendidos a un precio especial, perfecto para compartir con amigos o familia.",
    image: "/images/combo-deluxe.jpg", // Reemplaza con la ruta real de la imagen
  },
  {
    id: 2,
    name: "Combo Familiar",
    description:
      "Una selección completa diseñada para familias, con gran variedad y excelente relación calidad-precio.",
    image: "/images/family-combo.jpg",
  },
];

const productosActualizados = [
  {
    id: 1,
    name: "Hamburguesa de Pollo Crispy",
    price: "7,80€",
    image: "/images/crispy-chicken-burger.jpg", // Reemplaza con la ruta real de la imagen
  },
  {
    id: 2,
    name: "Wrap Vegetariano",
    price: "6,50€",
    image: "/images/veggie-wrap.jpg", // Reemplaza con la ruta real de la imagen
  },
  {
    id: 3,
    name: "Nachos Picantes",
    price: "4,20€",
    image: "/images/spicy-nachos.jpg", // Reemplaza con la ruta real de la imagen
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sección Hero */}
      <section className="bg-[#005c66] border boder-[white] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Bienvenido a Burda&apos;s Cafe Bar
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Descubre nuestros combos exclusivos y las últimas novedades de nuestro
          menú.
        </p>
        <Link
          href="/menu"
          className="inline-block bg-white text-[#005c66] px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Explora Nuestro Menú
        </Link>
      </section>

      {/* Sección de Combos */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Nuestros Combos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <Image
                src={combo.image}
                alt={combo.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {combo.name}
                </h3>
                <p className="text-gray-600 mb-4">{combo.description}</p>
                <Link
                  href="/menu/combos"
                  className="text-red-600 font-medium hover:underline"
                >
                  Ver Combo
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Productos Actualizados */}
      <section className="py-12 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Novedades
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {productosActualizados.map((producto) => (
            <div
              key={producto.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Image
                src={producto.image}
                alt={producto.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {producto.name}
                </h3>
                <p className="text-red-600 font-semibold">{producto.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
