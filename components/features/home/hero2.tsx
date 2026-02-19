export function Hero2() {
  return (
    <section className="relative overflow-hidden -mt-20 pt-20 min-h-[90vh] flex items-center bg-[#0f0a07] text-soft-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(214,163,72,0.2), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08), transparent 45%), linear-gradient(120deg, #0f0a07 0%, #1f1510 55%, #2a1c14 100%)",
        }}
      />

      <div className="absolute inset-0 bg-[url('/herobackground.png')] bg-cover bg-center opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl border border-royal-gold/30 bg-black/25 backdrop-blur-sm p-8 sm:p-12">
          <p className="montserrat uppercase tracking-[0.22em] text-xs sm:text-sm text-royal-gold mb-5">
            Launch Update
          </p>

          <h1 className="cormorant-garamond text-4xl sm:text-5xl lg:text-6xl leading-[0.95] text-balance mb-6">
            We&apos;re Launching Soon.
          </h1>

          <p className="montserrat text-sm sm:text-base text-soft-cream/90 leading-7 max-w-2xl">
            Meetreats is currently in pre-launch mode. Products are visible for
            preview only and cannot be ordered yet. We&apos;ll announce the opening
            date shortly.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal-gold/60 to-transparent" />
    </section>
  )
}
