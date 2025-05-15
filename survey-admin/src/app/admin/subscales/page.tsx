"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function SubscalesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
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

        {/* Title */}
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
            className="underline underline-offset-4 font-semibold"
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

        {/* Bottom border */}
        <div className="border-b border-black w-full" />

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-10 text-black">
          <div className="max-w-3xl w-full text-center space-y-4">
            <h2 className="text-2xl font-semibold">Subscale Management</h2>
            <p className="text-md">
              Define and manage subscales, which group specific questions and
              specify how to calculate scores using methods like{" "}
              <strong>sum</strong> or <strong>average</strong>. These subscales
              are used to generate raw scores for normalization.
            </p>
            <p className="text-md">
              Later, you'll be able to create new subscales, assign questions to
              them, and specify the scoring logic. For now, this page serves as
              a placeholder for future subscale creation and editing
              functionality.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
