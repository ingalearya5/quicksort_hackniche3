// import Link from "next/link";
// import { ShoppingBag } from "lucide-react";
// import { SignInButton, UserButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";

// export default function Navbar() {
//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center gap-6 md:gap-10">
//           <Link href="/" className="flex items-center space-x-2 transition-colors hover:opacity-80">
//             <ShoppingBag className="h-6 w-6 text-primary" />
//             <span className="font-bold text-lg tracking-wide inline-block">STYLEHUB</span>
//           </Link>
//           <nav className="hidden md:flex gap-6">
//             <Link
//               href="#"
//               className="text-sm font-medium transition-colors hover:text-primary relative group"
//             >
//               New Arrivals
//               <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
//             </Link>
//             <Link
//               href="#"
//               className="text-sm font-medium transition-colors hover:text-primary relative group"
//             >
//               Women
//               <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
//             </Link>
//             <Link
//               href="#"
//               className="text-sm font-medium transition-colors hover:text-primary relative group"
//             >
//               Men
//               <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
//             </Link>
//             <Link
//               href="#"
//               className="text-sm font-medium transition-colors hover:text-primary relative group"
//             >
//               Accessories
//               <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
//             </Link>
//           </nav>
//         </div>
//         <div className="flex items-center gap-4">
//           <Button asChild variant="secondary" className="text-primary font-medium shadow-sm hover:shadow-md transition-all">
//             <SignInButton>Get Started</SignInButton>
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// }
"use client"
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 transition-colors hover:opacity-80">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg tracking-wide inline-block text-blue-600">STYLEHUB</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 relative group"
            >
              New Arrivals
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 relative group"
            >
              Women
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 relative group"
            >
              Men
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 relative group"
            >
              Accessories
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="secondary" className="text-blue-600 font-medium shadow-sm hover:shadow-md transition-all hidden sm:inline-flex">
            <SignInButton>Get Started</SignInButton>
          </Button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 py-1"
              onClick={toggleMenu}
            >
              New Arrivals
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 py-1"
              onClick={toggleMenu}
            >
              Women
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 py-1"
              onClick={toggleMenu}
            >
              Men
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-blue-600 py-1"
              onClick={toggleMenu}
            >
              Accessories
            </Link>
            <Button asChild variant="secondary" className="text-blue-600 font-medium w-full mt-2">
              <SignInButton>Get Started</SignInButton>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}