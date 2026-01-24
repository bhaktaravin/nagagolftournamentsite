"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultName: string;
  defaultEmail: string;
  defaultZipcode: string;
  defaultHandicap: number | string;
};

export function ProfileForm({ defaultName, defaultEmail, defaultZipcode, defaultHandicap }: Props) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [zipcode, setZipcode] = useState(defaultZipcode);
  const [handicap, setHandicap] = useState(String(defaultHandicap));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/members/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim() || null,
          zipcode: zipcode.trim(),
          handicap: (() => {
            const t = handicap.trim();
            if (t === "") return null;
            const n = parseFloat(t);
            return isNaN(n) ? null : n;
          })(),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Update failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Zipcode</label>
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          className="input"
          placeholder="07030"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Handicap</label>
        <input
          type="text"
          inputMode="decimal"
          value={handicap}
          onChange={(e) => setHandicap(e.target.value)}
          className="input"
          placeholder="e.g. 12.5"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
