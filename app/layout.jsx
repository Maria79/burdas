import "@/assets/style/global.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Burda's Cafe Bar",
  description: "Todo con el inconfundible sabor del pollo crispy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
