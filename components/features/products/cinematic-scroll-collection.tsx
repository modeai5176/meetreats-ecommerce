"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/use-cart";
import { ArrowRight, ShoppingCart, Instagram } from "lucide-react";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to format category for display
const formatCategory = (category: string): string => {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Transform Product to the format expected by the component
const transformProduct = (product: Product) => ({
  id: product.id, // Keep as string for cart compatibility
  name: product.name,
  description: product.description || product.shortDescription,
  price: `₹${product.priceINR}`,
  image: product.images[0] || "/placeholder.svg",
  slug: product.slug,
  category: formatCategory(product.category),
  categoryValue: product.category,
  weight: product.weightGrams,
});

export function CinematicScrollCollection() {
  const [currentProduct, setCurrentProduct] = useState(0);
  const [allProducts, setAllProducts] = useState<
    ReturnType<typeof transformProduct>[]
  >([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ReturnType<typeof transformProduct>[]
  >([]);
  const { items, addItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("activated-almonds");
  const PRELAUNCH_MODE = true;

  const handleAddToCart = (
    product?: ReturnType<typeof transformProduct>
  ) => {
    if (PRELAUNCH_MODE || !product) {
      toast({
        title: "Launching soon",
        description:
          "Soon you can order products from our website. Stay tuned and follow us on Instagram for updates.",
        className: "bg-white/90",
      });
      return;
    }

    const priceNumber = Number(String(product.price).replace(/[^\d]/g, ""));
    addItem({
      id: product.id,
      name: product.name,
      price: priceNumber,
      weight: product.weight,
      image: product.image,
      slug: product.slug,
    });
  };

  const renderProductAction = (
    product: ReturnType<typeof transformProduct>,
    mobile = false
  ) => {
    const cartItem = items.find((i) => i.id === product.id);
    const quantity = cartItem?.quantity || 0;

    if (PRELAUNCH_MODE) {
      return (
        <Button
          size="lg"
          className={
            mobile
              ? "montserrat w-full bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 hover:scale-105 transition-all duration-500 py-4 text-base font-light tracking-wider border-0 rounded-none"
              : "bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 hover:scale-105 transition-all duration-500 px-8 py-4 text-lg font-light tracking-wider border-0 rounded-none montserrat"
          }
          onClick={() => handleAddToCart()}
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          Add to Cart
        </Button>
      );
    }

    if (quantity > 0) {
      return (
        <div
          className={
            mobile
              ? "flex items-center justify-center gap-4 w-full"
              : "flex items-center gap-4"
          }
        >
          <Button
            size="lg"
            variant="outline"
            className={
              mobile
                ? "border border-dark-chocolate/30 text-dark-chocolate hover:bg-dark-chocolate hover:text-soft-cream rounded-none px-4"
                : "border border-dark-chocolate/30 text-dark-chocolate hover:bg-dark-chocolate hover:text-soft-cream rounded-none px-5"
            }
            onClick={() => updateQuantity(product.id, quantity - 1)}
          >
            -
          </Button>
          <div className="montserrat text-lg min-w-[3ch] text-center">
            {quantity}
          </div>
          <Button
            size="lg"
            className={
              mobile
                ? "bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 rounded-none px-4"
                : "bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 rounded-none px-5"
            }
            onClick={() => updateQuantity(product.id, quantity + 1)}
          >
            +
          </Button>
        </div>
      );
    }

    return (
      <Button
        size="lg"
        className={
          mobile
            ? "montserrat w-full bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 hover:scale-105 transition-all duration-500 py-4 text-base font-light tracking-wider border-0 rounded-none"
            : "bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 hover:scale-105 transition-all duration-500 px-8 py-4 text-lg font-light tracking-wider border-0 rounded-none montserrat"
        }
        onClick={() => handleAddToCart(product)}
      >
        <ShoppingCart className="mr-3 h-5 w-5" />
        Add to Cart
      </Button>
    );
  };

  const filters = [
    { label: "Activated Almonds", value: "activated-almonds" },
    { label: "Dehydrated Fruits", value: "dehydrated-fruits" },
  ];

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch from API route (which uses Supabase)
        const response = await fetch("/api/products");
        const result = await response.json();
        if (result.success && result.data) {
          const transformed = result.data.map(transformProduct);
          setAllProducts(transformed);
        } else {
          console.error("Failed to fetch products from API");
          setAllProducts([]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setAllProducts([]);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const productIndex = Math.round(scrollPosition / windowHeight);
      if (productIndex >= 0 && productIndex < filteredProducts.length) {
        setCurrentProduct(productIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredProducts]);

  useEffect(() => {
    setFilteredProducts(
      allProducts.filter((product) => product.categoryValue === activeFilter)
    );
  }, [activeFilter, allProducts]);

  return (
    <div className="relative min-h-screen bg-soft-cream">
      {/* Sleek Filter Bar - Positioned below hero */}
      <div className="w-full bg-[#2a1914] py-4 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-8 py-3 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-300 flex-1 max-w-[200px] ${
                  activeFilter === filter.value
                    ? "bg-[#D4AF37] text-[#2a1914] shadow-lg"
                    : "bg-[#FFFDF7] text-[#2a1914] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.map((product, index) => {
        return (
          <section
            key={product.id}
            id={`product-${index}`}
            className="min-h-screen flex flex-col lg:flex-row items-center"
          >
            {/* Mobile: Full-width vertical stack */}
            <div className="lg:hidden w-full flex flex-col">
              {/* Full-width hero image */}
              <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    transform:
                      currentProduct === index ? "scale(1)" : "scale(1.05)",
                    filter:
                      currentProduct === index
                        ? "brightness(1)"
                        : "brightness(0.8)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-chocolate/20 to-transparent"></div>
              </div>

              {/* Product details - mobile */}
              <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 bg-soft-cream">
                <div className="max-w-md mx-auto text-center">
                  {/* Category */}
                  <div className="montserrat text-sm text-royal-gold uppercase tracking-wider font-medium mb-4">
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h2 className="cormorant-garamond text-3xl sm:text-4xl text-dark-chocolate font-semibold mb-4 leading-tight">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="montserrat text-sm sm:text-base text-charcoal/80 mb-4 leading-relaxed font-light">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="montserrat text-xl font-semibold text-dark-chocolate mb-6">
                    {product.price}
                  </div>

                  {/* CTA / Quantity Controls - Mobile */}
                  <div>{renderProductAction(product, true)}</div>
                </div>
              </div>

              {/* Aesthetic separator line for mobile */}
              <div className="h-10 sm:h-14 bg-soft-cream flex items-center justify-center">
                <div className="w-40 h-px bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent"></div>
              </div>
            </div>

            {/* Desktop: Split-screen layout */}
            <div className="hidden lg:flex w-full h-screen">
              {/* Left Column - Product Image (60%) */}
              <div className="w-3/5 relative overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    transform:
                      currentProduct === index ? "scale(1)" : "scale(1.05)",
                    filter:
                      currentProduct === index
                        ? "brightness(1)"
                        : "brightness(0.8)",
                  }}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-soft-cream/20" />
              </div>

              {/* Right Column - Product Details (40%) */}
              <div className="w-2/5 flex items-center justify-center px-8 lg:px-12">
                <div className="max-w-md space-y-8">
                  {/* Category */}
                  <div className="montserrat text-sm text-royal-gold uppercase tracking-wider font-medium">
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h2 className="cormorant-garamond text-4xl lg:text-5xl xl:text-6xl text-dark-chocolate font-semibold leading-tight">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="montserrat text-lg text-charcoal/80 leading-relaxed font-light">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="montserrat text-2xl font-semibold text-dark-chocolate">
                    {product.price}
                  </div>

                  {/* CTA / Quantity Controls + View Details */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {renderProductAction(product)}

                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="border border-dark-chocolate/30 text-dark-chocolate hover:bg-dark-chocolate hover:text-soft-cream transition-all duration-500 px-8 py-4 text-lg font-light tracking-wider rounded-none bg-transparent hover:scale-105 montserrat"
                    >
                      <Link href={`/products/${product.slug}`}>
                        View Details
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Instagram Follow Section */}
      <section className="pb-20 sm:pb-24 lg:pb-32 bg-soft-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Aesthetic line before content */}
          <div className="mb-16 sm:mb-20">
            <div className="h-px bg-gradient-to-r from-transparent via-royal-gold/60 to-transparent"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Two-line headline with color contrast */}
            <div className="mb-8">
              <div className="montserrat text-base sm:text-lg text-dark-chocolate mb-4 font-medium tracking-wider uppercase">
                FOLLOW US ON
              </div>
              <h2
                className="cormorant-garamond text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-royal-gold font-semibold tracking-tight"
                style={{
                  fontWeight: "700",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                INSTAGRAM
              </h2>
            </div>

            {/* Optional subtext */}
            <p className="montserrat text-sm sm:text-base text-dark-chocolate/70 mb-12 font-light tracking-wide">
              FOR DAILY INSPIRATION AND EXCLUSIVE UPDATES
            </p>

            {/* Instagram CTA */}
            <div className="text-center">
              <Link
                href="https://instagram.com/meetreatsofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 border border-dark-chocolate/20 hover:border-royal-gold/50 transition-all duration-300 rounded-lg montserrat"
              >
                <Instagram className="h-6 w-6 text-dark-chocolate group-hover:text-royal-gold transition-colors duration-300 mr-3" />
                <span className="montserrat text-base font-medium text-dark-chocolate group-hover:text-royal-gold transition-colors duration-300">
                  @MeeTreatsOfficial
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
