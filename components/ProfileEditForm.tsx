"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Defaults = {
  name: string;
  email: string;
  zipcode: string;
  handicap: string;
  homePhone: string;
  mpId: string;
  status: string;
  initiatedDate: string;
  slacksWaist: string;
  birthDate: string;
  address: string;
  ghin: string;
  memberType: string;
  groupOfInitiation: string;
  slacksLength: string;
  sex: string;
  club: string;
  level: string;
  shirtSize: string;
  shoeSize: string;
};

export function ProfileEditForm({ defaults }: { defaults: Defaults }) {
  const router = useRouter();
  const [form, setForm] = useState(defaults);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k: keyof Defaults) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name.trim() || null,
        email: form.email.trim() || null,
        zipcode: form.zipcode.trim(),
        handicap: parseNum(form.handicap, 0, 54),
        homePhone: form.homePhone.trim() || null,
        mpId: form.mpId.trim() || null,
        status: form.status.trim() || null,
        initiatedDate: form.initiatedDate || null,
        slacksWaist: parseNumInt(form.slacksWaist, 0, 99),
        birthDate: form.birthDate || null,
        address: form.address.trim() || null,
        ghin: form.ghin.trim() || null,
        memberType: form.memberType.trim() || null,
        groupOfInitiation: form.groupOfInitiation.trim() || null,
        slacksLength: parseNumInt(form.slacksLength, 0, 99),
        sex: form.sex.trim() || null,
        club: form.club.trim() || null,
        level: form.level.trim() || null,
        shirtSize: form.shirtSize.trim() || null,
        shoeSize: form.shoeSize.trim() || null,
      };
      const res = await fetch("/api/members/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Update failed.");
        return;
      }
      router.refresh();
      router.push("/dashboard/profile");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const input = "input";
  const row = "grid gap-4 sm:grid-cols-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input type="text" value={form.name} onChange={update("name")} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={form.email} onChange={update("email")} className={input} />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Zipcode</label>
          <input type="text" value={form.zipcode} onChange={update("zipcode")} className={input} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Handicap</label>
          <input type="text" inputMode="decimal" value={form.handicap} onChange={update("handicap")} className={input} placeholder="e.g. 12.5" />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Home Phone</label>
          <input type="tel" value={form.homePhone} onChange={update("homePhone")} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">MPId</label>
          <input type="text" value={form.mpId} onChange={update("mpId")} className={input} />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <input type="text" value={form.status} onChange={update("status")} className={input} placeholder="e.g. Joined" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Initiated Date</label>
          <input type="date" value={form.initiatedDate} onChange={update("initiatedDate")} className={input} />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Slacks Waist</label>
          <input type="text" inputMode="numeric" value={form.slacksWaist} onChange={update("slacksWaist")} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Birth Date</label>
          <input type="date" value={form.birthDate} onChange={update("birthDate")} className={input} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
        <textarea value={form.address} onChange={update("address")} className={input} rows={2} />
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">GHIN</label>
          <input type="text" value={form.ghin} onChange={update("ghin")} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Member Type</label>
          <input type="text" value={form.memberType} onChange={update("memberType")} className={input} />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Group Of Initiation</label>
          <input type="text" value={form.groupOfInitiation} onChange={update("groupOfInitiation")} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Slacks Length</label>
          <input type="text" inputMode="numeric" value={form.slacksLength} onChange={update("slacksLength")} className={input} />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sex</label>
          <select value={form.sex} onChange={update("sex")} className={input}>
            <option value="">—</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Club</label>
          <input type="text" value={form.club} onChange={update("club")} className={input} placeholder="NAGGA" />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Level</label>
          <input type="text" value={form.level} onChange={update("level")} className={input} placeholder="A, B, C, etc." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Shirt Size</label>
          <input type="text" value={form.shirtSize} onChange={update("shirtSize")} className={input} placeholder="e.g. M, L, XL" />
        </div>
      </div>
      <div className={row}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Shoe Size</label>
          <input type="text" value={form.shoeSize} onChange={update("shoeSize")} className={input} placeholder="e.g. 10.5" />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function parseNum(s: string, min: number, max: number): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = parseFloat(t);
  if (isNaN(n)) return null;
  return Math.min(max, Math.max(min, n));
}

function parseNumInt(s: string, min: number, max: number): number | null {
  const n = parseNum(s, min, max);
  return n == null ? null : Math.round(n);
}
