import "@/assets/style/global.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BasketProvider } from "@/context/BasketContext";
import AuthProvider from "@/components/AuthProvider";
import { CounterProvider } from "@/context/CounterContext";

export const metadata = {
  title: "Burda's Cafe Bar",
  description: "Todo con el inconfundible sabor del pollo crispy.",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <BasketProvider>
          <CounterProvider>
            <body className="flex flex-col min-h-screen">
              <Header />
              <div className="max-w-7xl mx-auto min-h-[75vh]">{children}</div>
              <Footer />
            </body>
          </CounterProvider>
        </BasketProvider>
      </html>
    </AuthProvider>
  );
}
