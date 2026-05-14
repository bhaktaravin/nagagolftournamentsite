"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

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
      const text = await res.text();
      let data: { error?: string; ok?: boolean } = {};
      try {
        data = text ? (JSON.parse(text) as typeof data) : {};
      } catch {
        setError(
          `Unexpected response (${res.status}). The server may be misconfigured — check deployment logs.`
        );
        return;
      }
      if (!res.ok) {
        setError(data.error || `Registration failed (${res.status}).`);
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
      <div className="space-y-2">
        <Label htmlFor="phone">Cell Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 555-123-4567"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="zipcode">Zipcode *</Label>
        <Input
          id="zipcode"
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="e.g. 07030"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Optional"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Joining..." : "Join NAGGA"}
      </Button>
    </form>
  );
}
