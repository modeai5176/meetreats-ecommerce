import { CartContent } from "@/components/features/cart/cart-content";

const PRELAUNCH_MODE = true;

export default function CartPage() {
  return (
    <div className="min-h-screen bg-soft-cream">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="cormorant-garamond text-3xl sm:text-4xl lg:text-5xl text-dark-chocolate mb-8 sm:mb-12 text-center paisley-separator px-4 font-bold">
            {PRELAUNCH_MODE ? "Cart Launching Soon" : "Shopping Cart"}
          </h1>
          <CartContent />
        </div>
      </div>
    </div>
  );
}
