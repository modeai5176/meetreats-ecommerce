"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingCart,
  Coffee,
  Utensils,
  Cookie,
  ExternalLink,
  Calendar,
  FlaskConical,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/hooks/use-cart";
import { getBatchByProductId } from "@/lib/data/products";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailProps {
  product: Product;
}

const PRELAUNCH_MODE = true;

const pairingOptions = [
  { name: "Coffee", icon: Coffee, description: "Perfect morning companion" },
  { name: "Yogurt", icon: Utensils, description: "Healthy breakfast topping" },
  { name: "Cheese Board", icon: Cookie, description: "Elegant party snack" },
];

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPricePer100g, setShowPricePer100g] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const { addItem, updateQuantity, items } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (PRELAUNCH_MODE) {
      toast({
        title: "Launching soon",
        description:
          "Soon you can order products from our website. Stay tuned and follow us on Instagram for updates.",
        className: "bg-white/90",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.priceINR,
      weight: product.weightGrams,
      image: product.images[0],
      slug: product.slug,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      className: "bg-white/90",
    });
  };

  const pricePer100g = Math.round(
    (product.priceINR / product.weightGrams) * 100
  );
  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <nav className="montserrat text-sm text-charcoal/70">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <span className="px-2">/</span>
          <span className="montserrat text-dark-chocolate/80">
            {product.name}
          </span>
        </nav>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-card">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/placeholder.svg?height=600&width=600&query=${product.name}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-royal-gold/10">
                <span className="text-charcoal/40">No image available</span>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    selectedImage === index
                      ? "border-gold-400"
                      : "border-border hover:border-royal-gold/60"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1
              className="montserrat text-4xl text-dark-chocolate font-semibold mb-2"
              style={{ fontWeight: 700 }}
            >
              {product.name}
            </h1>
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="text-left w-full montserrat text-lg text-charcoal/90 font hover:text-charcoal cursor-pointer transition-colors duration-200"
            >
              {product.shortDescription || (product.description ? `${product.description.substring(0, 100)}...` : '')}
            </button>
            {showDescription && product.description && (
              <p className="mt-3 montserrat text-base text-charcoal/80 leading-relaxed">
                {product.description}
            </p>
            )}
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent" />
          </div>

          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="bg-gold-600/20 text-gold-400"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="montserrat text-3xl font-bold text-dark-chocolate">
                ₹{product.priceINR}
              </span>
              <span className="text-charcoal/70 border border-royal-gold/30 rounded-full px-2 py-0.5 montserrat text-sm">
                {product.weightGrams}g
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPricePer100g(!showPricePer100g)}
              className="text-gold-400 hover:text-gold-300 p-0 h-auto montserrat"
            >
              {showPricePer100g ? "Show pack price" : "Show price per 100g"}
            </Button>

            {showPricePer100g && (
              <p className="montserrat text-lg text-charcoal/70">
                ₹{pricePer100g} per 100g
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex space-x-4">
            {!PRELAUNCH_MODE && quantity > 0 ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="border border-dark-chocolate/30 text-dark-chocolate hover:bg-dark-chocolate hover:text-soft-cream rounded-none px-5"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  -
                </Button>
                <div className="montserrat text-lg min-w-[3ch] text-center">
                  {quantity}
                </div>
                <Button
                  size="lg"
                  className="bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 rounded-none px-5 hover:scale-105 transition-transform duration-300"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                  +
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-dark-chocolate text-soft-cream hover:bg-dark-chocolate/90 montserrat font-medium rounded-none hover:scale-105 transition-transform duration-300"
                size="lg"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent" />

          {/* Batch Information */}
          <BatchInfo productId={product.id} />

          {/* Pairs Well With */}
          <div>
            <h3 className="montserrat font-semibold text-foreground mb-3">
              Pairs well with:
            </h3>
            <div className="flex space-x-2">
              {pairingOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 bg-transparent border-royal-gold/30 hover:bg-royal-gold/10 hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    toast({
                      title: "Great choice!",
                      description: `${
                        product.name
                      } ${option.description.toLowerCase()}`,
                      className: "bg-white/90", // Ensure light white background
                    });
                  }}
                >
                  <option.icon className="h-4 w-4" />
                  <span>{option.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Corporate Link */}
          <Card className="bg-gold-600/10 border-gold-400/20">
            <CardContent className="p-4">
              <p className="montserrat text-base text-foreground mb-2 font-bold">
                Need bulk quantities or custom hampers?
              </p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="montserrat border-gold-400 text-base text-foreground mb-2 font-bold"
              >
                <Link href="/gifting">
                  Get Corporate Quote
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Accordion */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-royal-gold/60 to-transparent" />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger className="montserrat">Ingredients</AccordionTrigger>
            <AccordionContent>
              {product.ingredients && product.ingredients.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="montserrat text-muted-foreground">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="montserrat text-muted-foreground">Ingredients information will be available soon.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="process">
            <AccordionTrigger className="montserrat">Our Process</AccordionTrigger>
            <AccordionContent>
              {product.processNotes && product.processNotes.length > 0 ? (
                <div className="space-y-2">
                  {product.processNotes.map((note, index) => (
                    <p key={index} className="montserrat text-muted-foreground">
                      • {note}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="montserrat text-muted-foreground">Process information will be available soon.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="storage">
            <AccordionTrigger className="montserrat">Storage & Shelf Life</AccordionTrigger>
            <AccordionContent>
              {product.storage ? (
                <p className="montserrat text-muted-foreground">{product.storage}</p>
              ) : (
                <p className="montserrat text-muted-foreground">Storage information will be available soon.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="allergens">
            <AccordionTrigger className="montserrat">Allergens</AccordionTrigger>
            <AccordionContent>
              {product.allergens.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {product.allergens.map((allergen, index) => (
                    <li key={index} className="montserrat text-muted-foreground">
                      {allergen}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="montserrat text-muted-foreground">No known allergens</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nutrition">
            <AccordionTrigger className="montserrat">
              Nutrition Information
              {product.isProvisionalNutrition && (
                <Badge variant="outline" className="ml-2">
                  Provisional
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              {product.nutritionPdf ? (
                <div className="space-y-2">
                  <p className="montserrat text-muted-foreground">
                    Detailed nutrition information is available in our
                    lab-tested report.
                  </p>
                  <Button variant="outline" size="sm" asChild className="montserrat">
                    <Link href={product.nutritionPdf} target="_blank">
                      View Nutrition Report
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="montserrat text-muted-foreground">
                  Nutrition information will be available once lab testing is
                  complete.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function BatchInfo({ productId }: { productId: string }) {
  const [batch, setBatch] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    getBatchByProductId(productId).then((batchData) => {
      setBatch(batchData);
      setIsLoading(false);
    });
  });

  if (isLoading || !batch) {
    return null;
  }

  const sealedDate = new Date(batch.sealedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gold-400" />
          <span className="montserrat text-sm font-medium text-foreground">
            Nitrogen-sealed on {sealedDate}
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gold-400 hover:text-gold-300 p-0 h-auto montserrat"
            >
              <FlaskConical className="h-4 w-4 mr-1" />
              See lab report for batch {batch.code}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="montserrat">Lab Report - Batch {batch.code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="montserrat text-muted-foreground">
                This batch was sealed on {sealedDate} and has undergone
                comprehensive lab testing for quality and safety.
              </p>
              <Button asChild className="w-full montserrat">
                <Link href={batch.labReportPdf} target="_blank">
                  View Full Lab Report
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
