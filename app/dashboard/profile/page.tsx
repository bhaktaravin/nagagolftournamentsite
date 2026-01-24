import Link from "next/link";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatShortDate } from "@/lib/formatDate";

export default async function ProfilePage() {
  const member = await getMember();
  if (!member) return null;

  const m = await prisma.member.findUnique({
    where: { id: member.id },
  });
  if (!m) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-fairway">My Profile</h1>
        <div className="flex gap-4">
          <Link href="/dashboard/profile/edit" className="text-fairway hover:underline">
            Update Profile
          </Link>
          <Link href="/dashboard/profile/handicap-history" className="text-fairway hover:underline">
            Handicap History
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4">
          <ProfileField label="Name" value={m.name} />
          <ProfileField label="Email" value={m.email} mailto />
          <ProfileField label="Home Phone" value={m.homePhone} />
          <ProfileField label="MPId" value={m.mpId} />
          <ProfileField label="Status" value={m.status} />
          <ProfileField label="Initiated Date" value={m.initiatedDate ? formatShortDate(m.initiatedDate) : null} />
          <ProfileField label="Slacks Waist" value={m.slacksWaist} />
        </div>

        {/* Middle column */}
        <div className="space-y-4">
          <ProfileField label="Zipcode" value={m.zipcode} />
          <ProfileField label="Birth Date" value={m.birthDate ? formatShortDate(m.birthDate) : null} />
          <ProfileField label="Address" value={m.address} />
          <ProfileField label="GHIN" value={m.ghin} />
          <ProfileField label="Member Type" value={m.memberType} />
          <ProfileField label="Group Of Initiation" value={m.groupOfInitiation} />
          <ProfileField label="Slacks Length" value={m.slacksLength} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <ProfileField label="Sex" value={m.sex} />
          <ProfileField label="Mobile Phone" value={m.phone} />
          <ProfileField label="Club" value={m.club} />
          <ProfileField label="Handicap" value={m.handicap != null ? m.handicap.toFixed(2) : null} />
          <ProfileField label="Level" value={m.level} />
          <ProfileField label="Shirt Size" value={m.shirtSize} />
          <ProfileField label="Shoe Size" value={m.shoeSize} />
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  mailto,
}: {
  label: string;
  value: string | number | null | undefined;
  mailto?: boolean;
}) {
  const v = value == null || (typeof value === "string" && value === "") ? "—" : String(value);
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-gray-900">
        {mailto && v !== "—" && /@/.test(v) ? (
          <a href={`mailto:${v}`} className="text-fairway hover:underline">
            {v}
          </a>
        ) : (
          v
        )}
      </dd>
    </div>
  );
}
