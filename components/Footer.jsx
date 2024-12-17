import { FaEnvelope, FaMapMarker, FaPhone } from "react-icons/fa";
import FooterMap from "./FooterMap";
import Image from "next/image";

import logo from "@/assets/images/burda-logo.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white px-6 pt-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-center mb-8">
          <Image src={logo} alt="" width={200} height={200} sizes="100vw" />
        </div>
        <div className="container flex flex-col md:flex-row md:justify-between items-center mb-4">
          <div className="flex justify-between mb-8 md:mb-0">
            <div className="text-sm">
              <p className="mb-2">
                <FaMapMarker className="text-[#e23e34] inline-block mr-2" />
                <span className="font-semibold">Direccion:</span>
                <Link href="https://www.google.com/maps/place/Burdas+Cafe+Bar/@28.3677894,-16.7073914,17z/data=!3m1!4b1!4m6!3m5!1s0xc6a87fe9cc7b15d:0x8a521dfcd90eae01!8m2!3d28.3677894!4d-16.7073914!16s%2Fg%2F11gxrwq9t8?hl=en&entry=ttu&g_ep=EgoyMDI0MTIwMy4wIKXMDSoASAFQAw%3D%3D">
                  Calle Fray Cristóbal Oramas N° 74, Icod de los Vinos, Tenerife
                </Link>
              </p>
              <p className="mb-2">
                <FaPhone className="inline-block mr-2" />
                <span className="font-semibold">Telefono:</span>{" "}
                <a
                  href="tel:+34635641383"
                  className="text-blue-500 hover:underline"
                >
                  635 64 13 83
                </a>
              </p>
              <p className="mb-2">
                <FaEnvelope className="inline-block mr-2" />
                <span className="font-semibold">Email: </span>
                <a href="mailto:burdascafebar@gmail.com">
                  burdascafebar@gmail.com
                </a>
              </p>
            </div>
          </div>
          <FooterMap />
        </div>
      </div>
      <div className="flex justify-center">
        <p className="pt-4 text-sm md:text-md">
          © {new Date().getFullYear()} VJK developers. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
