"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Välkommen ombord!");
      } else {
        setMessage("❌ " + data.error);
      }
    } catch {
      setMessage("❌ Något gick fel. Vi har blivit notifierade. Vänligen försök igen senare.");
    }

    setLoading(false);
    setEmail("");
  };

  return (
    <div className="px-2 py-3 lg:px-5 border-t border-solid border-black">
      <div>
        <div className="w-full flex flex-col md:flex-row justify-between gap-2">
          <h3 className="text-sans-35 lg:text-sans-60 font-600">
            Prenumerera på nyhetsbrevet
          </h3>
          <div className="max-w-[360px] w-full">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full input-newsletter border p-2"
                  required
                  aria-label="Nyhetsbrev e-post"
                  placeholder="din@epost.se"
                />
                <button
                  aria-label="Submit"
                  type="submit"
                  className="link-arrow-submit absolute top-0 right-0 bottom-0 border border-solid w-8 lg:w-10 h-[60px] lg:h-[70px] bg-[--vividGreen]"
                  disabled={loading}
                >
                  {loading ? "..." : "→"}
                </button>
              </div>
              <label className="block mt-1 text-sans-12 uppercase tracking-wider font-600">
                E-post
              </label>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}