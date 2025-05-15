"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function NormalizationPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  if (!user) return null;

  return (
    <div className="h-screen w-screen bg-[#faebd7] p-4 box-border">
      <div className="h-full w-full border-4 border-black rounded-xl flex flex-col relative">
        {/* Top-right user menu */}
        <div className="absolute top-4 right-6">
          <details className="cursor-pointer text-black">
            <summary className="hover:text-yellow-600">Welcome, {user}</summary>
            <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow p-2 z-10">
              <li>
                <button onClick={logout} className="hover:text-red-500">
                  Logout
                </button>
              </li>
            </ul>
          </details>
        </div>

        {/* Page title */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-black">
            Survey Administrator
          </h1>
        </div>

        {/* Navigation bar */}
        <nav className="flex justify-center gap-10 text-black text-md font-medium pb-2">
          <Link href="/admin" className="hover:underline underline-offset-4">
            Home
          </Link>
          <Link
            href="/admin/questions"
            className="hover:underline underline-offset-4"
          >
            Questions
          </Link>
          <Link
            href="/admin/subscales"
            className="hover:underline underline-offset-4"
          >
            Subscales
          </Link>
          <Link
            href="/admin/normalization"
            className="underline underline-offset-4 font-semibold"
          >
            Normalization
          </Link>
        </nav>

        {/* Thin bottom border */}
        <div className="border-b border-black w-full" />

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-10 text-black">
          <div className="max-w-3xl w-full text-center space-y-4">
            <h2 className="text-2xl font-semibold">
              Normalization Table Management
            </h2>
            <p className="text-md">
              Upload and manage normalization tables that map raw subscale
              scores to standardized values based on a user’s{" "}
              <strong>age</strong> and <strong>gender</strong>.
            </p>
            <p className="text-md">
              These tables allow the system to convert calculated subscale
              scores into meaningful percentiles or normalized metrics, useful
              for research interpretation or benchmarking.
            </p>
            <p className="text-md italic">
              Coming soon: CSV import, validation, and visualization of
              normalization data.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
