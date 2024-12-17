import "@/assets/style/global.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-7xl mx-auto min-h-[75vh]">{children}</div>
      </body>
    </html>
  );
}
