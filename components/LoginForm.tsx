"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), zipcode: zipcode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.refresh();
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Your Cell Phone Number</Label>
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
        <Label htmlFor="zipcode">Your Zipcode</Label>
        <Input
          id="zipcode"
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="e.g. 07030"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 border-t pt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Dev Shortcuts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setPhone("9998887777");
                setZipcode("00000");
              }}
            >
              Set Admin
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setPhone("5551234567");
                setZipcode("07030");
              }}
            >
              Set User
            </Button>
          </div>
        </div>
      )}



    </form>
  );
}
