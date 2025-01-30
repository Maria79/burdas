import Each from "./Each";
import Extras from "./Extras";
import Recommendations from "./Recommendations";
import Types from "./Types";

const VentasPedidos = ({ orders }) => {
  const totalOrders = orders.length;

  // Calculate type counts
  const typeCounts = orders
    .flatMap((order) => order.basket.map((x) => x.type))
    .reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

  // Extract extras grouped by their name
  const extrasCount = orders
    .flatMap((order) => order.basket.flatMap((item) => item.extras))
    .reduce((acc, extra) => {
      acc[extra.name] = (acc[extra.name] || 0) + 1;
      return acc;
    }, {});

  // Group items by type and name
  const groupedItems = orders
    .flatMap((order) => order.basket)
    .reduce((acc, { name, type }) => {
      if (!acc[type]) {
        acc[type] = [];
      }

      // Check if the item already exists in the type category
      const existingItem = acc[type].find((item) => item.name === name);

      if (existingItem) {
        existingItem.count += 1;
      } else {
        acc[type].push({ name, count: 1 });
      }

      return acc;
    }, {});

  return (
    <div className="w-full pt-4 pb-8">
      <h2 className="text-2xl font-bold mb-4  text-gray-800">
        Ventas de Pedidos
      </h2>
      <p className="mb-4 text-gray-700">
        Pedidos totales:{" "}
        <span className="font-semibold text-gray-900">{totalOrders}</span>
      </p>
      <div className="flex flex-col  gap-2">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2 ">
            <Types typeCounts={typeCounts} />
          </div>
          <div className="w-full md:w-1/2">
            <Each groupedItems={groupedItems} />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <Extras extrasCount={extrasCount} />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-center mt-6">Pedidos</h1>
          <Recommendations orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default VentasPedidos;
