"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ContactModal } from "./contact-modal";

type Role = "creator" | "brand";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

export const Newsletter = () => {
  const [role, setRole] = useState<Role>("creator");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative z-10 flex flex-col items-center w-full h-full">

      {/* Header — logo pinned at the top, above all content */}
      <motion.header
        {...fadeUp(0)}
        className="w-full flex justify-center pt-10 sm:pt-14 px-6 flex-shrink-0"
      >
        <Image
          src="/logo-full.png"
          alt="Disciple"
          width={360}
          height={108}
          className="h-16 sm:h-20 lg:h-24 w-auto invert"
          priority
        />
      </motion.header>

      {/* Center content — fills remaining height */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 gap-6 lg:gap-7 pb-36">

        {/* Headline + Subheadline */}
        <motion.div
          className="flex flex-col items-center gap-3 text-center max-w-xl"
          {...fadeUp(0.1)}
        >
          <h1
            className="font-serif italic text-5xl sm:text-6xl lg:text-7xl leading-tight text-white text-balance drop-shadow-lg"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            We craft stories that build{" "}
            <strong className="not-italic font-black">disciples.</strong>
          </h1>
          <p
            className="text-sm sm:text-base text-white/90 leading-relaxed max-w-sm text-balance"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
          >
            Strategic storytelling, influencer growth, and content that turns casual followers into loyal movements.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="w-full max-w-xs flex flex-col gap-4"
          {...fadeUp(0.22)}
        >
          {/* Supporting copy */}
          <p
            className="text-center text-white text-xs leading-relaxed px-1 font-medium"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
          >
            Tell us about your project &mdash; whether you&apos;re a creator
            ready to scale or a brand seeking authentic voices.
          </p>

          {/* Segmented role toggle */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-white text-xs font-semibold tracking-widest uppercase"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              I am a
            </span>
            <div
              className="flex w-full rounded-full border border-white/30 bg-white/10 backdrop-blur-md p-1 gap-1"
              style={{
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 24px rgba(0,0,0,0.2)",
              }}
            >
              {(["creator", "brand"] as Role[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={cn(
                    "flex-1 rounded-full py-2 text-xs font-semibold capitalize transition-all duration-200 focus:outline-none",
                    role === option ? "text-black" : "text-white/70 hover:text-white"
                  )}
                  style={
                    role === option
                      ? {
                          background:
                            "linear-gradient(160deg, rgba(255,255,255,1) 0%, rgba(210,210,210,0.95) 100%)",
                          boxShadow:
                            "inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.2)",
                        }
                      : undefined
                  }
                >
                  {option === "creator" ? "Creator" : "Brand"}
                </button>
              ))}
            </div>
          </div>

          {/* CTA — opens modal */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="relative overflow-hidden w-full h-11 rounded-full text-sm font-semibold tracking-wide text-black transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,1) 0%, rgba(195,195,195,0.95) 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.95), inset 0 -1px 1px rgba(0,0,0,0.1), 0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.6) 50%, transparent 62%)",
                animation: "shine 2.6s ease-in-out infinite",
              }}
            />
            {"Let's Chat"}
          </button>
        </motion.div>
      </div>

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRole={role}
      />
    </div>
  );
};
