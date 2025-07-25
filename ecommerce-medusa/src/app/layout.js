import { Geist, Geist_Mono } from "next/font/google";
import "./styles/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav style={{ padding: '10px' }}>
          <a href="/" style={{ marginRight: '10px' }}>Home</a>
          <a href="/produtos" style={{ marginRight: '10px' }}>Produtos</a>
          <a href="/admin/estoque" style={{ marginRight: '10px' }}>Estoque</a>
          <a href="/admin/pedidos" style={{ marginRight: '10px' }}>Pedidos</a>
          <a href="/checkout">Checkout</a>
        </nav>
        {children}
      </body>
    </html>
  );
}