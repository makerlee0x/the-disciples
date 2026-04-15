"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { submitContact } from "@/lib/submit-contact";

type Role = "creator" | "brand";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  initialRole: Role;
}

const SOCIAL_PLATFORMS = [
  {
    id: "tiktok",
    label: "TikTok",
    placeholder: "TikTok URL",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "Instagram URL",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    placeholder: "YouTube URL",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "Facebook URL",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X",
    placeholder: "X (Twitter) URL",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Other",
    placeholder: "Other profile URL",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
      </svg>
    ),
  },
];

const ENQUIRY_OPTIONS = [
  "I am a brand looking for content, influencers, or UGC creators",
  "I'd like to work with Disciple as an influencer, Content Creator, or UGC creator",
  "I'd like to apply for an internship with Disciple",
];

// Normalizes any input into a full URL for a given platform
const normalizeSocialUrl = (id: string, value: string): string => {
  if (!value.trim()) return "";
  let v = value.trim();

  // Strip leading @ symbol
  if (v.startsWith("@")) v = v.slice(1);

  // Already a full URL — return as-is
  if (/^https?:\/\//i.test(v)) return v;

  // Has a domain-like structure (contains a dot) — just prepend https://
  // This covers: www.x.com/user, tiktok.com/@user, jesuscoin.xyz, etc.
  if (/^www\./i.test(v) || v.includes(".")) return `https://${v}`;

  // Plain username / handle — build the platform URL
  const bases: Record<string, string> = {
    tiktok: "https://www.tiktok.com/@",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/@",
    facebook: "https://www.facebook.com/",
    x: "https://x.com/",
    other: "https://",
  };

  const base = bases[id] ?? "https://";
  return `${base}${v}`;
};

const normalizeWebsiteUrl = (value: string): string => {
  if (!value.trim()) return "";
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.25)",
  padding: "10px 16px",
  color: "white",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.03em",
  outline: "none",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12)",
  transition: "border-color 0.2s, background 0.2s",
};

export const ContactModal = ({ open, onClose, initialRole }: ContactModalProps) => {
  const [role, setRole] = useState<Role>(initialRole);
  const [submitted, setSubmitted] = useState(false);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [enquiry, setEnquiry] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setRole(initialRole);
      setSubmitted(false);
      setSocialLinks({});
      setEnquiry("");
      setName("");
      setEmail("");
      setWebsite("");
      setMessage("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, initialRole]);

  const handleSocialChange = (id: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Required";
    if (!email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (!enquiry) newErrors.enquiry = "Required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await submitContact({
      role,
      name,
      email,
      enquiry,
      socialLinks,
      website: website || undefined,
      message: message || undefined,
    });

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrors({ submit: result.error || "Submission failed" });
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", background: "rgba(0,0,0,0.45)" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative pointer-events-auto w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 24px 80px rgba(0,0,0,0.4)",
              }}
            >
              {/* Subtle top shine line */}
              <div
                className="absolute top-0 left-8 right-8 h-px pointer-events-none rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
              />

              <div className="relative p-5 flex flex-col gap-4">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white transition-colors focus:outline-none text-lg leading-none"
                  aria-label="Close"
                >
                  ×
                </button>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-6 py-16 text-center"
                  >
                    <Image
                      src="/logo-full.png"
                      alt="Disciple"
                      width={450}
                      height={135}
                      className="h-36 w-auto"
                    />
                    <p
                      className="font-serif italic text-3xl text-white"
                      style={{ textShadow: "0 0 30px rgba(160,200,255,0.6)" }}
                    >
                      {"We'll be in touch."}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    {/* Title */}
                    <div className="text-center pt-2 pb-1">
                      <h2
                        className="font-serif italic text-2xl text-white"
                        style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
                      >
                        Let&apos;s work together.
                      </h2>
                    </div>

                    {/* Role toggle */}
                    <div
                      className="flex w-full rounded-full p-1 gap-1"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12)",
                      }}
                    >
                      {(["creator", "brand"] as Role[]).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setRole(option)}
                          className={cn(
                            "flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 focus:outline-none",
                            role === option ? "text-black" : "text-white/35 hover:text-white/70"
                          )}
                          style={
                            role === option
                              ? {
                                  background: "linear-gradient(160deg, rgba(255,255,255,1) 0%, rgba(200,215,230,0.96) 100%)",
                                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.3)",
                                }
                              : undefined
                          }
                        >
                          {option === "creator" ? "Creator" : "Brand"}
                        </button>
                      ))}
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1">
                      <input
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                        placeholder={role === "brand" ? "COMPANY NAME" : "YOUR NAME"}
                        style={{ ...fieldStyle, borderColor: errors.name ? "rgba(255,100,100,0.7)" : "rgba(255,255,255,0.25)" }}
                      />
                      {errors.name && <span className="text-red-400 text-[10px] px-4">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                        placeholder="EMAIL"
                        style={{ ...fieldStyle, borderColor: errors.email ? "rgba(255,100,100,0.7)" : "rgba(255,255,255,0.25)" }}
                      />
                      {errors.email && <span className="text-red-400 text-[10px] px-4">{errors.email}</span>}
                    </div>

                    {/* Enquiry dropdown */}
                    <div className="flex flex-col gap-1">
                    <div className="relative">
                      <select
                        name="enquiry"
                        value={enquiry}
                        onChange={(e) => { setEnquiry(e.target.value); setErrors((p) => ({ ...p, enquiry: "" })); }}
                        style={{
                          ...fieldStyle,
                          appearance: "none",
                          cursor: "pointer",
                          paddingRight: "36px",
                          color: enquiry ? "white" : "rgba(255,255,255,0.45)",
                          borderColor: errors.enquiry ? "rgba(255,100,100,0.7)" : "rgba(255,255,255,0.25)",
                        }}
                      >
                        <option value="" disabled hidden style={{ color: "#666" }}>WHAT BRINGS YOU HERE</option>
                        {ENQUIRY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} style={{ background: "#0a0e1a", color: "white", fontWeight: 400 }}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <span
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-bold"
                      >
                        ▾
                      </span>
                    </div>
                    {errors.enquiry && <span className="text-red-400 text-[10px] px-4">{errors.enquiry}</span>}
                    </div>

                    {/* Social links — each platform gets its own pill field with icon */}
                    <div className="flex flex-col gap-2">
                      {SOCIAL_PLATFORMS.map(({ id, label, placeholder, icon }) => (
                        <div key={id} className="relative flex items-center">
                          <span className="absolute left-4 pointer-events-none flex items-center" style={{ top: "50%", transform: "translateY(-50%)" }}>
                            {icon}
                          </span>
                          <input
                            name={`social_${id}`}
                            type="text"
                            placeholder={placeholder}
                            value={socialLinks[id] || ""}
                            onChange={(e) => handleSocialChange(id, e.target.value)}
                            onBlur={(e) => {
                              const normalized = normalizeSocialUrl(id, e.target.value);
                              if (normalized) handleSocialChange(id, normalized);
                            }}
                            style={{ ...fieldStyle, paddingLeft: "44px" }}
                            aria-label={label}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Website */}
                    <input
                      name="website"
                      type="text"
                      placeholder="WEBSITE"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      onBlur={(e) => {
                        const normalized = normalizeWebsiteUrl(e.target.value);
                        if (normalized) setWebsite(normalized);
                      }}
                      style={fieldStyle}
                    />

                    {/* Message */}
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="MESSAGE"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        ...fieldStyle,
                        borderRadius: "16px",
                        resize: "none",
                        lineHeight: "1.6",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                      }}
                    />

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative overflow-hidden w-full h-11 rounded-full font-semibold tracking-wide text-sm transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(160deg, rgba(255,255,255,1) 0%, rgba(195,195,195,0.95) 100%)",
                        color: "#111",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.95), inset 0 -1px 1px rgba(0,0,0,0.1), 0 4px 24px rgba(0,0,0,0.3)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{
                          background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.55) 50%, transparent 62%)",
                          animation: "shine 2.6s ease-in-out infinite",
                        }}
                      />
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>

                    {/* Contact email below submit */}
                    <p className="text-center text-white/45 text-[11px] leading-relaxed">
                      For anything else, reach out to{" "}
                      <a
                        href="mailto:hello@disciple.vip"
                        className="text-white/65 hover:text-white transition-colors"
                      >
                        hello@disciple.vip
                      </a>
                    </p>

                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
