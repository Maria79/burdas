import Image from "next/image";
import Navbar from "./Navbar";
import logo from "@/assets/images/burda-logo.png";

const Header = () => {
  return (
    <div className="w-full relative bg-[#760e0e] text-white flex flex-col md:justify-between items-center px-6 py-8">
      <Image src={logo} alt="" width={250} height={200} sizes="100vw" />
      <Navbar />
    </div>
  );
};

export default Header;
