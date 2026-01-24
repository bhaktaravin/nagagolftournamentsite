"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  eventId: string;
  isRegistered: boolean;
  isFull: boolean;
};

export function EventActions({ eventId, isRegistered, isFull }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function register() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function unregister() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/unregister`, {
        method: "POST",
      });
      if (!res.ok) {
        setError("Could not unregister.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (isRegistered) {
    return (
      <button
        type="button"
        onClick={unregister}
        disabled={loading}
        className="btn-secondary"
      >
        {loading ? "Updating…" : "Cancel registration"}
      </button>
    );
  }

  if (isFull) {
    return (
      <p className="text-amber-700">This event is full. You can no longer register.</p>
    );
  }

  return (
    <button
      type="button"
      onClick={register}
      disabled={loading}
      className="btn-primary"
    >
      {loading ? "Registering…" : "Register for this event"}
    </button>
  );
}
