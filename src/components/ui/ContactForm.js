"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

// Sends messages through Web3Forms when profile.web3formsKey is set (Phase 6).
// Until then it opens the visitor's email app with the message already filled in.

const fieldClass =
  "rounded-[10px] border border-[#22304f] bg-panel px-3.5 py-3 text-[15px] text-fg placeholder:text-faint focus:border-accent-light focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    // Fallback: no Web3Forms key yet, so hand the message to the visitor's email app
    if (!profile.web3formsKey) {
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: profile.web3formsKey,
          subject: `New message from ${name} via panjimaulana.web.app`,
          from_name: "Portfolio website",
          name,
          email,
          message,
          botcheck: data.get("botcheck") ? true : "",
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[18px] rounded-2xl border border-line bg-panel/90 p-6 md:p-7"
    >
      <h3 className="font-display text-[22px] font-semibold text-heading">Send a message</h3>

      {/* Hidden spam trap: real visitors never tick this */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <label className="flex flex-col gap-2 text-[13px] font-medium text-muted">
        Name
        <input name="name" type="text" required autoComplete="name" placeholder="Your name" className={fieldClass} />
      </label>

      <label className="flex flex-col gap-2 text-[13px] font-medium text-muted">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-[13px] font-medium text-muted">
        Message
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell me about the role or project"
          className={`${fieldClass} resize-y`}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="min-h-12 rounded-[10px] bg-accent px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#1d4fd8] disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      <p aria-live="polite" className="min-h-5 text-sm">
        {status === "sent" && <span className="text-success">Thank you! Your message has been sent.</span>}
        {status === "error" && (
          <span className="text-[#f87171]">
            Something went wrong. Please email me directly at {profile.email}.
          </span>
        )}
      </p>
    </form>
  );
}
