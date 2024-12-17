import DishesDisplay from "@/components/DishesDisplay";
import connectDB from "@/config/database";
import Dishes from "@/models/Dishes";

export const fetchDishes = async (typeParams) => {
  await connectDB();
  const dishes = await Dishes.find({ type: typeParams });
  return JSON.parse(JSON.stringify(dishes)); // Serialize data for the client
};

const ItemPage = async ({ params }) => {
  const typeParams = params.item;

  // Fetch dishes server-side
  const dishes = await fetchDishes(typeParams);

  return <DishesDisplay dishes={dishes} typeParams={typeParams} />;
};

export default ItemPage;
