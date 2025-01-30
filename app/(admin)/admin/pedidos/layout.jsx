import "@/assets/style/global.css";

export const metadata = {
  title: "Admin: Pedidos",
  description: "",
};

export default function PedidosLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      {children}
    </div>
  );
}
