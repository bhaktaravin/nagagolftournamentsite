import { getMember } from "@/lib/auth";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const member = await getMember();
  if (!member) return null;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-fairway">Profile</h1>
      <p className="mb-8 text-gray-600">
        Update your member information. Phone is used to log in and cannot be changed here.
      </p>

      <div className="card max-w-lg">
        <ProfileForm
          defaultName={member.name ?? ""}
          defaultEmail={member.email ?? ""}
          defaultZipcode={member.zipcode}
          defaultHandicap={member.handicap ?? ""}
        />
      </div>
    </div>
  );
}
