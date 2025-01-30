import VentasPedidos from "./Pedidos";

const Ventas = ({ orders }) => {
  return (
    <div>
      <VentasPedidos orders={orders} />
    </div>
  );
};

export default Ventas;
