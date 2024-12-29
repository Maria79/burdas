import Image from "next/image";
import Navbar from "./Navbar";
import logo from "@/assets/images/burda-logo.png";
import connectDB from "@/config/database";
import Dishes from "@/models/Dishes";
import User from "@/models/User";

export const fetchDishes = async (typeParams) => {
  await connectDB();
  const dishes = await Dishes.find({ type: typeParams });

  return JSON.parse(JSON.stringify(dishes)); // Converts all fields, including _id
};

const Header = async () => {
  const dishes = await fetchDishes();

  return (
    <div className="w-full relative bg-[#760e0e]">
      <div className="max-w-7xl mx-auto text-white flex flex-col md:justify-between items-center px-6 py-8">
        <Image src={logo} alt="" width={250} height={200} sizes="100vw" />
        <Navbar dishes={dishes} />
      </div>
    </div>
  );
};

export default Header;
