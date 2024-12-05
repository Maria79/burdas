import ItemCard from "@/components/ItemCard";

const MenuPage = () => {
  return (
    <div className="px-6 py-8">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-semibold">Menu</h1>
      </div>
      <section className="px-4">
        <h2 className="text-3xl font-semibold mb-4">Enrollados</h2>
        <div>
          <ItemCard />
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
