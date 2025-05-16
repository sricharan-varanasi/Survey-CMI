"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Question, Subscale } from "./SubscaleTypes";
import SubscaleEditor from "./SubscaleEditor";
import NormalizationViewer from "./NormalizationViewer";

export default function SubscalesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [subscales, setSubscales] = useState<Subscale[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Subscale | null>(null);
  const [editing, setEditing] = useState<Subscale | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingTable, setViewingTable] = useState(false);

  useEffect(() => {
    if (!user) router.push("/");
    else {
      fetchSubscales();
      fetchQuestions();
    }
  }, [user]);

  const fetchSubscales = async () => {
    const res = await fetch("https://survey-cmi.site/subscales/");
    const data = await res.json();
    setSubscales(data);
    if (!selected && data.length > 0) setSelected(data[0]);
  };

  const fetchQuestions = async () => {
    const res = await fetch("https://survey-cmi.site/questions/");
    const data = await res.json();
    setQuestions(data);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setIsEditing(true);
    setEditing({ name: "", method: "sum", question_ids: [] });
    setSelected(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditing(null);
    setIsAdding(false);
    setViewingTable(false);
    if (subscales.length > 0) setSelected(subscales[0]);
  };

  const handleSave = async () => {
    if (!editing) return;
    const method = isAdding ? "POST" : "PATCH";
    const url = isAdding
      ? "https://survey-cmi.site/subscales/"
      : `https://survey-cmi.site/subscales/${editing.id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await fetchSubscales();
      setIsEditing(false);
      setEditing(null);
      setIsAdding(false);
    } else {
      alert("Failed to save subscale");
    }
  };

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
        <div className="border-b border-black w-full" />

        <main className="flex flex-1 overflow-hidden">
          <div className="w-1/3 p-4 border-r border-black overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Subscales</h2>
              <button
                onClick={handleAddNew}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                + Add
              </button>
            </div>
            {subscales.map((s) => (
              <div
                key={s.id}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  selected?.id === s.id
                    ? "bg-black text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelected(s);
                  setEditing(null);
                  setIsEditing(false);
                  setIsAdding(false);
                  setViewingTable(false);
                }}
              >
                {s.name}
              </div>
            ))}
          </div>

          <div className="w-2/3 p-6 overflow-y-auto">
            {viewingTable && selected ? (
              <NormalizationViewer
                subscaleId={selected.id!}
                subscaleName={selected.name}
                onBack={() => setViewingTable(false)}
              />
            ) : (
              <>
                <SubscaleEditor
                  subscale={isEditing ? editing : selected}
                  isEditing={isEditing}
                  isNew={isAdding}
                  questions={questions}
                  setSubscale={setEditing}
                  onEdit={() => {
                    setEditing(JSON.parse(JSON.stringify(selected)));
                    setIsEditing(true);
                  }}
                  onCancel={handleCancel}
                  onSave={handleSave}
                />

                {!isEditing && !isAdding && selected && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setViewingTable(true)}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                    >
                      View Normalization Table
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
