import { redirect } from "next/navigation";
import Link from "next/link";
import { getMember } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getMember();
  if (!member) redirect("/");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
