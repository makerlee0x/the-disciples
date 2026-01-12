import { HeroSection } from "@/components/hero-section"

export default function Page() {
  return (
    <main className="relative h-screen overflow-hidden">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 h-full">
        <HeroSection />
      </div>
    </main>
  )
}
