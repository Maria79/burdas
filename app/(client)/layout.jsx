import "@/assets/style/global.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BasketProvider } from "@/context/BasketContext";
import AuthProvider from "@/components/AuthProvider";
import { CounterProvider } from "@/context/CounterContext";
import { Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";

export const metadata = {
  title: "Burda's Cafe Bar",
  description: "Todo con el inconfundible sabor del pollo crispy.",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="es">
        <BasketProvider>
          <CounterProvider>
            <body className="flex flex-col min-h-screen">
              <Suspense
                fallback={<div className="text-center p-4">Loading...</div>}
              >
                <Header />
              </Suspense>
              <div className="max-w-7xl mx-auto min-h-[75vh]">{children}</div>
              <Footer />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
              />
            </body>
          </CounterProvider>
        </BasketProvider>
      </html>
    </AuthProvider>
  );
}
