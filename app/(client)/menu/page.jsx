import ItemCard from "@/components/ItemCard";
import connectDB from "@/config/database";
import Dishes from "@/models/Dishes";

export const fetchDishes = async (typeParams) => {
  await connectDB();
  const dishes = await Dishes.find({ type: typeParams });

  return JSON.parse(JSON.stringify(dishes)); // Converts all fields, including _id
};

const MenuPage = async () => {
  const typeParams = "enrollados";

  // Fetch dishes server-side
  const dishes = await fetchDishes("enrollados");

  // const enrollados = await Dishes.find({ type: "enrollados" });

  return (
    <div className="px-6 py-8">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-semibold">Menu</h1>
      </div>
    </div>
  );
};

export default MenuPage;
