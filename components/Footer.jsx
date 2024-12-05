import { FaEnvelope, FaMapMarker, FaPhone } from "react-icons/fa";
import FooterMap from "./FooterMap";
import Image from "next/image";

import logo from "@/assets/images/burda-logo.png";
import Link from "next/link";

const Footer = () => {
  const actualYear = new Date();
  return (
    <footer className="bg-slate-800 text-white px-6 py-8">
      <div className="flex justify-center mb-4">
        <Image src={logo} alt="" width={200} height={200} sizes="100vw" />
      </div>
      <div className="container flex flex-col md:flex-row items-center">
        <div>
          <div className="text-sm">
            <p className="mb-2">
              <FaMapMarker className="inline-block mr-2" />
              <span className="font-semibold">Direccion:</span>
              <Link href="https://www.google.com/maps/place/Burdas+Cafe+Bar/@28.3677894,-16.7073914,17z/data=!3m1!4b1!4m6!3m5!1s0xc6a87fe9cc7b15d:0x8a521dfcd90eae01!8m2!3d28.3677894!4d-16.7073914!16s%2Fg%2F11gxrwq9t8?hl=en&entry=ttu&g_ep=EgoyMDI0MTIwMy4wIKXMDSoASAFQAw%3D%3D">
                Calle Fray Cristóbal Oramas N° 74, Icod de los Vinos, Spain
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
      <div className="flex justify-center">
        <p>© {new Date().getFullYear()} My Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
