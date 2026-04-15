"use server";

import { createClient } from "./supabase/server";
import { Resend } from "resend";

interface ContactFormData {
  role: "creator" | "brand";
  name: string;
  email: string;
  enquiry: string;
  socialLinks: Record<string, string>;
  website?: string;
  message?: string;
}

export async function submitContact(data: ContactFormData) {
  try {
    const supabase = await createClient();

    // Insert into contacts table
    const { data: insertedData, error: insertError } = await supabase
      .from("contacts")
      .insert([
        {
          role: data.role,
          name: data.name,
          email: data.email,
          enquiry: data.enquiry,
          website: data.website || null,
          social_links: data.socialLinks,
          message: data.message || null,
        },
      ])
      .select();

    if (insertError) {
      console.error("[v0] Insert error:", insertError);
      return { success: false, error: "Failed to save contact information" };
    }

    // Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const socialLinksText = Object.entries(data.socialLinks)
      .filter(([, url]) => url)
      .map(([platform, url]) => `${platform}: ${url}`)
      .join("\n");

    const emailContent = `
New Contact Form Submission from Disciple

Type: ${data.role === "creator" ? "Creator" : "Brand"}
Name: ${data.name}
Email: ${data.email}
Enquiry: ${data.enquiry}
Website: ${data.website || "Not provided"}

Social Links:
${socialLinksText || "None provided"}

Message:
${data.message || "No message provided"}
    `;

    try {
      const emailResult = await resend.emails.send({
        from: "noreply@noreply.disciple.vip",
        to: "hello@disciple.vip",
        replyTo: data.email,
        subject: `New Contact: ${data.name} (${data.role})`,
        text: emailContent,
      });
      console.log("[v0] Email sent successfully:", emailResult);
    } catch (emailError) {
      console.error("[v0] Email send error:", emailError);
      console.error("[v0] API Key available:", !!process.env.RESEND_API_KEY);
      // Data was saved to Supabase, but email failed. Still return success since the form submission worked.
      return {
        success: true,
        message: "Thank you for reaching out! We'll be in touch soon.",
      };
    }

    return {
      success: true,
      message: "Thank you for reaching out! We'll be in touch soon.",
    };
  } catch (error) {
    console.error("[v0] Submit contact error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
