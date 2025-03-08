
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default function Home() {
 
  const { userId } = auth();
  if (userId) {
    redirect("/homepage")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold inline-block">STYLEHUB</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                New Arrivals
              </Link>
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Women
              </Link>
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Men
              </Link>
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Accessories
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="secondary" className="text-primary">
              <SignInButton>Get Started</SignInButton>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Discover Your Style, Elevate Your Wardrobe
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Shop the latest trends with free shipping on orders over
                    $50. New collections added weekly.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="px-8">
                    Shop Now
                  </Button>
                  <Button size="lg" variant="outline" className="px-8">
                    View Collections
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] overflow-hidden rounded-xl md:h-[450px] lg:h-[600px]">
                <Image
                  src="/placeholder.svg?height=600&width=400"
                  alt="Featured collection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Featured Products
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our handpicked selection of trending items that are
                  flying off the shelves.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group relative overflow-hidden rounded-lg border bg-background"
                >
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=400&width=400`}
                      alt={`Product ${item}`}
                      width={400}
                      height={400}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">Product Name</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-primary text-primary"
                            />
                          ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        (42)
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">$99.00</span>
                      <Button size="sm" variant="outline">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" className="gap-1">
                View All Products <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Shop With Us
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're committed to providing the best shopping experience
                  possible.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background">
                <Truck className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Free Shipping</h3>
                <p className="text-center text-sm text-muted-foreground">
                  On all orders over $50
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Secure Payment</h3>
                <p className="text-center text-sm text-muted-foreground">
                  100% secure payment
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background">
                <Clock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">24/7 Support</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Dedicated support
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background">
                <ShoppingBag className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Easy Returns</h3>
                <p className="text-center text-sm text-muted-foreground">
                  30 day return policy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What Our Customers Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. Here's what our customers
                  have to say.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 md:grid-cols-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-lg border bg-background p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-1">
                      <Image
                        src={`/placeholder.svg?height=40&width=40`}
                        alt={`Customer ${item}`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Customer Name</h3>
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-primary text-primary"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    "I absolutely love shopping here! The quality of the
                    products is outstanding, and the customer service is
                    exceptional. Will definitely be a returning customer."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Stay Updated
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Subscribe to our newsletter
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get the latest updates on new products, sales, and style
                  guides straight to your inbox.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row lg:justify-end">
                <div className="flex-1 min-w-[180px]">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} StyleHub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
