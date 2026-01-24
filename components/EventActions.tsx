"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  eventId: string;
  isRegistered: boolean;
  isWaitlisted: boolean;
  isFull: boolean;
};

export function EventActions({ eventId, isRegistered, isWaitlisted, isFull }: Props) {
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

  if (isWaitlisted) {
    return (
      <div className="space-y-3">
        <p className="rounded-md bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-800">
          You are on the waitlist.
        </p>
        <button
          type="button"
          onClick={unregister}
          disabled={loading}
          className="text-sm text-gray-500 hover:text-red-600 underline"
        >
          {loading ? "Updating…" : "Leave waitlist"}
        </button>
      </div>
    );
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
      <div className="space-y-3">
        <p className="text-amber-700">This event is full.</p>
        <button
          type="button"
          onClick={register}
          disabled={loading}
          className="btn-primary bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
        >
          {loading ? "Joining..." : "Join Waitlist"}
        </button>
      </div>
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
