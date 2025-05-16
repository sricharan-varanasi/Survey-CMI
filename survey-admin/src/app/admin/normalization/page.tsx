"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type User = {
  id: number;
  name: string;
  age: number;
  gender: string;
};

type Question = {
  id: number;
  text: string;
};

type Response = {
  question_id: number;
  answer: string;
  raw_score: number;
  question: Question;
};

export default function NormalizationPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!user) router.push("/");
    else fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://survey-cmi.site/users/");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0]);
          fetchResponses(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchResponses = async (userId: number) => {
    try {
      const res = await fetch(
        `https://survey-cmi.site/users/${userId}/responses`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setResponses(data);
        setCurrentIdx(0);
      }
    } catch (err) {
      console.error("Failed to fetch responses:", err);
    }
  };

  const handleUserClick = (u: User) => {
    setSelectedUser(u);
    fetchResponses(u.id);
  };

  const current = responses[currentIdx];

  if (!user) return null;

  return (
    <div className="h-screen w-screen bg-[#faebd7] p-4 box-border">
      <div className="h-full w-full border-4 border-black rounded-xl flex flex-col relative">
        {/* Top-right user dropdown */}
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

        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-black">
            Survey Administrator
          </h1>
        </div>

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
        <div className="border-b border-black w-full" />

        <main className="flex flex-1 overflow-hidden">
          {/* Sidebar with users */}
          <div className="w-1/3 p-4 border-r border-black overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Survey Users</h2>
            {Array.isArray(users) &&
              users.map((u) => (
                <div
                  key={u.id}
                  className={`p-2 mb-2 rounded cursor-pointer ${
                    selectedUser?.id === u.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleUserClick(u)}
                >
                  {u.name}
                </div>
              ))}
          </div>

          {/* Flashcard Viewer */}
          <div className="w-2/3 p-6">
            {selectedUser && (
              <>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedUser.name} — Age {selectedUser.age},{" "}
                    {selectedUser.gender}
                  </h2>
                </div>

                {responses.length > 0 && current ? (
                  <div className="space-y-4">
                    <div className="border p-4 rounded shadow bg-white">
                      <h3 className="text-md font-medium mb-2">Question:</h3>
                      <p className="text-black">{current.question?.text}</p>

                      <h3 className="text-md font-medium mt-4">Answer:</h3>
                      <p className="text-blue-600">{current.answer}</p>

                      <div className="mt-6 p-3 bg-gray-100 border rounded">
                        <strong>Raw Score:</strong> {current.raw_score} <br />
                        <strong>Normalization Score:</strong>{" "}
                        <span className="text-sm text-gray-500">
                          (To be implemented)
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentIdx((i) => Math.max(i - 1, 0))}
                        disabled={currentIdx === 0}
                        className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentIdx((i) =>
                            Math.min(i + 1, responses.length - 1)
                          )
                        }
                        disabled={currentIdx === responses.length - 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No responses found for this user.
                  </p>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
