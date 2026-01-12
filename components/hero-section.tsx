"use client"

import { useEffect, useRef } from "react"
import { SplitFlapText } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative h-screen flex items-center justify-center px-6 md:px-12">
      <AnimatedNoise opacity={0.03} />

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full max-w-4xl mx-auto text-center">
        <SplitFlapText text="$JESUS" speed={80} />

        <h2 className="font-[var(--font-bebas)] text-muted-foreground/80 text-[clamp(1.5rem,4vw,3rem)] mt-8 tracking-wide">
          Do Good, Give More.
        </h2>

        <p className="mt-12 max-w-2xl mx-auto font-mono text-sm md:text-base text-muted-foreground leading-relaxed">
          Command them to do good, to be rich in good deeds, and to be generous and willing to share. In this way they
          will lay up treasure for themselves as a firm foundation for the coming age, so that they may take hold of the
          life that is truly life.
        </p>
        <p className="mt-4 font-mono text-xs text-muted-foreground/60 tracking-widest uppercase">1 Timothy 6:18-19</p>

        <a
          href="https://x.com/jesustokens"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-12 text-white hover:text-white/70 transition-colors"
          aria-label="Follow on X"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </section>
  )
}
