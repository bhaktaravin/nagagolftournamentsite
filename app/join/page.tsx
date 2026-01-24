import Link from "next/link";
import { JoinForm } from "@/components/JoinForm";

export default function JoinPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-fairway">
            NAGGA
          </Link>
          <Link href="/" className="text-gray-600 hover:text-fairway">
            Back to Login
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-2 text-2xl font-semibold text-fairway">Join NAGGA</h1>
        <p className="mb-8 text-gray-600">
          Become a member of the North American Gujarati Golf Association. Use your
          cell number and zipcode to log in after joining.
        </p>
        <div className="card">
          <JoinForm />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link href="/" className="font-medium text-fairway hover:underline">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
