// import { Hero } from "@/components/features/home/hero"
import { Hero2 } from "@/components/features/home/hero2"
import { ValuePropStrip } from "@/components/features/home/value-prop-strip"
import { ProcessStrip } from "@/components/features/home/process-strip"
import { FeaturedProducts } from "@/components/features/home/featured-products"
import { CraftedWithoutCompromise } from "@/components/features/home/crafted-without-compromise"
import { CorporateGiftingShowcase } from "@/components/features/home/corporate-gifting-showcase"
import { InstagramSection } from "@/components/features/home/instagram-section"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* <Hero /> */}
      <Hero2 />
      <ValuePropStrip />
      <ProcessStrip />
      <FeaturedProducts />
      <CraftedWithoutCompromise />
      <CorporateGiftingShowcase />
      <InstagramSection />
    </div>
  )
}
