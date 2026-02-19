"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const PRELAUNCH_MODE = true;

export function CartContent() {
  const { items } = useCart();

  if (PRELAUNCH_MODE) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white/80 backdrop-blur-sm border border-royal-gold/30 shadow-xl rounded-2xl px-8 py-12 w-full max-w-2xl text-center">
          <div className="p-6 rounded-full bg-royal-gold/10 w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-royal-gold/30">
            <ShoppingBag className="h-10 w-10 text-royal-gold" />
          </div>
          <h2 className="cormorant-garamond text-3xl sm:text-4xl text-dark-chocolate mb-4">
            Cart Launching Soon
          </h2>
          <p className="montserrat text-base text-warm-taupe mb-8 max-w-xl mx-auto leading-7">
            Ordering is not live yet. Soon you can add products and checkout
            directly on the website. Stay tuned and follow us on Instagram for
            launch updates.
          </p>
          <Button
            asChild
            className="bg-royal-gold/90 hover:bg-royal-gold text-dark-chocolate font-semibold px-8 py-3 rounded-full text-base shadow-md transition-all duration-300"
          >
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white/80 backdrop-blur-sm border border-royal-gold/30 shadow-xl rounded-2xl px-8 py-12 w-full max-w-lg text-center">
          <div className="p-6 rounded-full bg-royal-gold/10 w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-royal-gold/30">
            <ShoppingBag className="h-10 w-10 text-royal-gold" />
          </div>
          <h2 className="cormorant-garamond text-3xl sm:text-4xl text-dark-chocolate mb-4">
            Your cart is empty
          </h2>
          <p className="montserrat text-base text-warm-taupe mb-8 max-w-md mx-auto">
            Add some delicious snacks to get started!
          </p>
          <Button
            asChild
            className="bg-royal-gold/90 hover:bg-royal-gold text-dark-chocolate font-semibold px-8 py-3 rounded-full text-base shadow-md transition-all duration-300"
          >
            <Link href="/products">Shop Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white/80 backdrop-blur-sm border border-royal-gold/30 shadow-xl rounded-2xl p-4 sm:p-6"
          >
            <CartItem item={item} />
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white/80 backdrop-blur-sm border border-royal-gold/30 shadow-xl rounded-2xl p-4 sm:p-6">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
