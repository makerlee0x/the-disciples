"use server";

import { createClient } from "./supabase/server";

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

    // Send email via Resend (or your email service)
    // For now, we'll just log it - you can integrate with Resend, SendGrid, etc.
    const emailContent = `
New Contact Form Submission

Role: ${data.role === "creator" ? "Creator" : "Brand"}
Name: ${data.name}
Email: ${data.email}
Enquiry Type: ${data.enquiry}
Website: ${data.website || "Not provided"}
Message: ${data.message || "Not provided"}

Social Links:
${
  Object.entries(data.socialLinks)
    .filter(([, url]) => url)
    .map(([platform, url]) => `${platform}: ${url}`)
    .join("\n") || "None provided"
}
    `;

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    console.log("[v0] Email to send:\n", emailContent);

    return {
      success: true,
      message: "Thank you for reaching out! We'll be in touch soon.",
    };
  } catch (error) {
    console.error("[v0] Submit contact error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
