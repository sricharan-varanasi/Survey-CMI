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

type Subscale = {
  id: number;
  name: string;
  method: "sum" | "average";
  question_ids: number[];
};

type NormEntry = {
  age: number;
  sex: string;
  raw_score: number;
  normalized_score: number;
};

export default function NormalizationPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [subscales, setSubscales] = useState<Subscale[]>([]);
  const [subscale, setSubscale] = useState<Subscale | null>(null);
  const [normalizationData, setNormalizationData] = useState<NormEntry[]>([]);

  useEffect(() => {
    if (!user) router.push("/");
    else {
      fetchUsers();
      fetchSubscales();
    }
  }, [user]);

  const fetchUsers = async () => {
    const res = await fetch("https://survey-cmi.site/users/");
    const data = await res.json();
    if (Array.isArray(data)) {
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[0]);
        fetchResponses(data[0].id);
      }
    }
  };

  const fetchResponses = async (userId: number) => {
    const res = await fetch(
      `https://survey-cmi.site/users/${userId}/responses`
    );
    const data = await res.json();
    if (Array.isArray(data)) {
      setResponses(data);
      setCurrentIdx(0);
    }
  };

  const fetchSubscales = async () => {
    const res = await fetch("https://survey-cmi.site/subscales/");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      setSubscales(data);
      setSubscale(data[0]);
      fetchNormalizationTable(data[0].id);
    }
  };

  const fetchNormalizationTable = async (subscaleId: number) => {
    const res = await fetch(
      `https://survey-cmi.site/subscales/${subscaleId}/normalization-table/`
    );
    const data = await res.json();
    if (Array.isArray(data)) setNormalizationData(data);
  };

  const handleSubscaleChange = (id: number) => {
    const found = subscales.find((s) => s.id === id);
    if (found) {
      setSubscale(found);
      fetchNormalizationTable(found.id);
    }
  };

  const computeRawScore = () => {
    if (!subscale) return 0;
    const relevant = responses.filter((r) =>
      subscale.question_ids.includes(r.question_id)
    );
    const values = relevant.map((r) => r.raw_score);
    if (subscale.method === "sum") return values.reduce((a, b) => a + b, 0);
    if (subscale.method === "average")
      return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return 0;
  };

  const getNormalizationScore = (raw: number) => {
    if (!selectedUser) return null;
    const entry = normalizationData.find(
      (e) =>
        e.raw_score === raw &&
        e.age === selectedUser.age &&
        e.sex === selectedUser.gender
    );
    return entry?.normalized_score ?? null;
  };

  const handleUserClick = (u: User) => {
    setSelectedUser(u);
    fetchResponses(u.id);
  };

  const current = responses[currentIdx];
  const totalRaw = computeRawScore();
  const normScore = getNormalizationScore(totalRaw);

  if (!user) return null;

  return (
    <div className="h-screen w-screen bg-[#faebd7] p-4 box-border">
      <div className="h-full w-full border-4 border-black rounded-xl flex flex-col relative">
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
          <div className="w-1/3 p-4 border-r border-black overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
            <h2 className="text-xl font-semibold mb-4">Survey Users</h2>
            {users.map((u) => (
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

          <div className="w-2/3 p-6">
            {selectedUser && (
              <>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedUser.name} — Age {selectedUser.age},{" "}
                    {selectedUser.gender}
                  </h2>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Choose Subscale:
                  </label>
                  <select
                    className="p-2 border rounded"
                    value={subscale?.id || ""}
                    onChange={(e) =>
                      handleSubscaleChange(Number(e.target.value))
                    }
                  >
                    {subscales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {responses.length > 0 && current ? (
                  <div className="space-y-4">
                    <div className="border p-4 rounded shadow bg-white">
                      <h3 className="text-md font-medium mb-2">Question:</h3>
                      <p className="text-black">{current.question?.text}</p>

                      <h3 className="text-md font-medium mt-4">Answer:</h3>
                      <p className="text-blue-600">{current.answer}</p>

                      <h3 className="text-md font-medium mt-4">Raw Score:</h3>
                      <p className="text-black">{current.raw_score}</p>
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

                    <div className="mt-6 p-4 bg-gray-100 border rounded">
                      <strong>Total Raw Score:</strong> {totalRaw} <br />
                      <strong>Normalization Score:</strong>{" "}
                      {normScore ?? (
                        <span className="text-red-500">Not found</span>
                      )}
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
