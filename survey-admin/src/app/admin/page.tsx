"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="h-screen w-screen bg-[#faebd7] p-4 box-border">
      <div className="h-full w-full border-4 border-black rounded-xl flex flex-col relative">
        {/* User dropdown */}
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

        {/* Header title */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-black">
            Survey Administrator
          </h1>
        </div>

        {/* Navigation Bar */}
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
            className="hover:underline underline-offset-4"
          >
            Normalization
          </Link>
        </nav>

        {/* Single bottom line under navbar */}
        <div className="border-b border-black w-full" />

        {/* Main Content: Centered block */}
        <main className="flex-1 flex items-center justify-center px-10 py-6 text-black">
          <div className="max-w-3xl w-full space-y-6">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📄</span>
              <div>
                <h2 className="text-xl font-semibold mb-1">Questions</h2>
                <p className="text-sm">
                  Manage your survey questions. Create single-selection
                  questions with custom text and associate each answer option
                  with a raw score.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="text-2xl">🧠</span>
              <div>
                <h2 className="text-xl font-semibold mb-1">Subscales</h2>
                <p className="text-sm">
                  Create subscales that define how to group specific questions
                  together and calculate a summary score using sum or average
                  logic.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-xl font-semibold mb-1">Normalization</h2>
                <p className="text-sm">
                  Upload normalization tables to convert subscale raw scores
                  into standardized scores based on age and gender. Useful for
                  benchmarking.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
