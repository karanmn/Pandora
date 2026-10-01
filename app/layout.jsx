import "./globals.css";

export const metadata = {
  title: "Pandora",
  description: "Pandora Trading and Gaming Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0e1014] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
