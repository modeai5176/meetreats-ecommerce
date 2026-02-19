"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PRELAUNCH_MODE = true;

interface ProductCardProps {
  product: Product;
  showPricePer100g?: boolean;
}

export function ProductCard({
  product,
  showPricePer100g = false,
}: ProductCardProps) {
  const { addItem, updateQuantity, items } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const showQuantityControl = !PRELAUNCH_MODE && quantity > 0;

  const handleAddToCart = async () => {
    if (PRELAUNCH_MODE) {
      toast({
        title: "Launching soon",
        description:
          "Soon you can order products from our website. Stay tuned and follow us on Instagram for updates.",
        className: "bg-white/90",
      });
      return;
    }

    if (isAdding) return;

    setIsAdding(true);

    addItem({
      id: product.id,
      name: product.name,
      price: product.priceINR,
      weight: product.weightGrams,
      image: product.images[0],
      slug: product.slug,
    });

    setIsAdded(true);

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(false);
    }, 1000);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      updateQuantity(product.id, 0);
    }
  };

  const pricePer100g = Math.round(
    (product.priceINR / product.weightGrams) * 100
  );

  return (
    <div className="relative">
      <Card
        className={`relative overflow-hidden rounded-2xl shadow-sm bg-[#FFFDF7] border border-[#CBB27A]/20 transition-all duration-300 ease-out group hover:brightness-105 ${
          showQuantityControl
            ? "-translate-y-4 shadow-2xl scale-105"
            : "hover:shadow-2xl hover:-translate-y-4 hover:scale-105"
        }`}
      >
        {/* Soft light overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out rounded-2xl pointer-events-none" />

        {/* Image Area */}
        <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={
                product.images[0] ||
                `/placeholder.svg?height=300&width=300&query=${product.name}`
              }
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </Link>

          {/* Tags - positioned at top of image */}
          {product.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-2">
              {product.badges.slice(0, 2).map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="border border-[#CBB27A]/40 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm shadow-sm"
                  style={{ backgroundColor: "#2a1914" }}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {showQuantityControl && (
            <div className="absolute top-3 right-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#CBB27A] via-[#D4AF37] to-[#CBB27A] opacity-80 blur-sm"></div>
                <div
                  className="relative text-white text-xs font-bold px-3 py-2 rounded-full shadow-xl border-2 border-[#CBB27A] backdrop-blur-sm"
                  style={{ backgroundColor: "#2a1914" }}
                >
                  {quantity} in cart
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Content Area - Fixed height container */}
        <div className="relative">
          {/* Always Visible Content */}
          <CardContent className="p-4 pb-2">
            <div className="space-y-2">
              {/* Product Title */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="montserrat text-lg font-semibold text-dark-chocolate group-hover:text-[#CBB27A] transition-colors duration-500 ease-in-out line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              {/* Price */}
              <div className="flex items-baseline space-x-1">
                <span className="montserrat text-sm text-[#5C5042]/60 font-medium uppercase tracking-wider">
                  ₹
                </span>
                <span
                  className="montserrat text-xl font-bold group-hover:text-[#B89A4F] transition-colors duration-500 ease-in-out"
                  style={{ color: "#2a1914" }}
                >
                  {product.priceINR}
                </span>
                <span className="montserrat text-xs text-[#5C5042]/70 font-medium ml-2">
                  {product.weightGrams}g
                </span>
              </div>
            </div>
          </CardContent>

          {/* Expandable Content - Hidden by default, revealed on hover */}
          <div className="max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {/* Description */}
                <p className="montserrat text-[#6B5C4A] text-sm leading-snug line-clamp-2 font-light">
                  {product.shortDescription}
                </p>

                {/* Price per 100g (if enabled) */}
                {showPricePer100g && (
                  <p className="montserrat text-xs text-[#5C5042]/50 font-light">
                    ₹{pricePer100g}/100g
                  </p>
                )}

                {/* Premium indicator */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#CBB27A] rounded-full animate-pulse"></div>
                  <span className="montserrat text-xs text-[#5C5042]/60 font-medium uppercase tracking-wider">
                    Premium Quality
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Dynamic Add to Cart Button / Quantity Control (kept for post-launch) */}
            <CardFooter className="p-4 pt-0">
              {!showQuantityControl ? (
                <Button
                  onClick={handleAddToCart}
                  className={`w-full font-medium text-sm py-2 px-4 rounded-full transition-all duration-500 ease-in-out montserrat ${
                    isAdded
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30"
                      : "text-white hover:scale-105 active:scale-95"
                  } ${isAdding ? "animate-pulse" : ""}`}
                  style={{
                    backgroundColor: isAdded ? undefined : "#2a1914",
                    boxShadow: isAdded
                      ? undefined
                      : "0 0 15px rgba(42, 25, 20, 0.4)",
                  }}
                  disabled={!product.inStock || isAdding}
                >
                  <div className="flex items-center justify-center">
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4 mr-2 animate-bounce" />
                        <span className="font-semibold">Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        <span>
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </span>
                      </>
                    )}
                  </div>
                </Button>
              ) : (
                <div className="w-full bg-[#CBB27A] rounded-full p-1 shadow-lg hover:shadow-[0_0_15px_rgba(203,178,122,0.4)] transition-all duration-300 ease-in-out">
                  <div className="flex items-center justify-between bg-white rounded-full px-4 py-2">
                    <button
                      onClick={handleDecreaseQuantity}
                      className="w-8 h-8 rounded-full bg-[#CBB27A] text-white hover:bg-[#B89A4F] transition-colors duration-200 ease-in-out flex items-center justify-center font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="montserrat font-semibold text-[#CBB27A] text-sm min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncreaseQuantity}
                      className="w-8 h-8 rounded-full bg-[#CBB27A] text-white hover:bg-[#B89A4F] transition-colors duration-200 ease-in-out flex items-center justify-center font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
