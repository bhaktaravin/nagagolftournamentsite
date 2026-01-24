import Link from "next/link";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileEditForm } from "@/components/ProfileEditForm";

export default async function ProfileEditPage() {
  const member = await getMember();
  if (!member) return null;

  const m = await prisma.member.findUnique({
    where: { id: member.id },
  });
  if (!m) return null;

  const toIso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

  return (
    <div>
      <Link href="/dashboard/profile" className="mb-4 inline-block text-sm text-gray-600 hover:text-fairway">
        ← Back to My Profile
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-fairway">Update Profile</h1>
      <div className="card max-w-3xl">
        <ProfileEditForm
          defaults={{
            name: m.name ?? "",
            email: m.email ?? "",
            zipcode: m.zipcode,
            handicap: m.handicap != null ? String(m.handicap) : "",
            homePhone: m.homePhone ?? "",
            mpId: m.mpId ?? "",
            status: m.status ?? "",
            initiatedDate: toIso(m.initiatedDate),
            slacksWaist: m.slacksWaist != null ? String(m.slacksWaist) : "",
            birthDate: toIso(m.birthDate),
            address: m.address ?? "",
            ghin: m.ghin ?? "",
            memberType: m.memberType ?? "",
            groupOfInitiation: m.groupOfInitiation ?? "",
            slacksLength: m.slacksLength != null ? String(m.slacksLength) : "",
            sex: m.sex ?? "",
            club: m.club ?? "",
            level: m.level ?? "",
            shirtSize: m.shirtSize ?? "",
            shoeSize: m.shoeSize ?? "",
          }}
        />
      </div>
    </div>
  );
}
