"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function JoinForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/members/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          zipcode: zipcode.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      router.refresh();
      router.push("/?joined=1");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
          Cell Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 555-123-4567"
          className="input"
          required
        />
      </div>
      <div>
        <label htmlFor="zipcode" className="mb-1 block text-sm font-medium text-gray-700">
          Zipcode *
        </label>
        <input
          id="zipcode"
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="e.g. 07030"
          className="input"
          required
        />
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional"
          className="input"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Optional"
          className="input"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Joining…" : "Join NAGGA"}
      </button>
    </form>
  );
}
