import {Poppins } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

import Chatbot from "./components/Chatbot";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${poppins.className}  antialiased`}
      >
        <Toaster />
        <CartProvider >
        {children}
        </CartProvider>
        <Chatbot />
      </body>
    </html>
    </ClerkProvider>
  );
}
