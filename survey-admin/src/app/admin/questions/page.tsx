/* ----------------------------------
   1. QuestionsPage (Main Layout)
---------------------------------- */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuestionEditor from "./QuestionEditor";

export type Option = {
  id?: number;
  text: string;
  raw_score: number;
};

export type Question = {
  id?: number;
  text: string;
  options: Option[];
};

export default function QuestionsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [editing, setEditing] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!user) router.push("/");
    else fetchQuestions();
  }, [user]);

  const fetchQuestions = async () => {
    const res = await fetch("https://survey-cmi.site/questions/");
    const data = await res.json();
    setQuestions(data);
    if (!selected && data.length) setSelected(data[0]);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setIsEditing(true);
    const newQuestion: Question = {
      text: "",
      options: [
        { text: "", raw_score: 0 },
        { text: "", raw_score: 0 },
        { text: "", raw_score: 0 },
        { text: "", raw_score: 0 },
      ],
    };
    setEditing(newQuestion);
    setSelected(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditing(null);
    setIsAdding(false);
    if (questions.length > 0) setSelected(questions[0]);
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    const confirmDelete = confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    const res = await fetch(
      `https://survey-cmi.site/questions/${selected.id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      await fetchQuestions();
      setSelected(null);
      setEditing(null);
      setIsEditing(false);
      setIsAdding(false);
    } else {
      alert("Failed to delete question");
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    const method = isAdding ? "POST" : "PATCH";
    const url = isAdding
      ? "https://survey-cmi.site/questions/"
      : `https://survey-cmi.site/questions/${editing.id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: editing.text,
        options: editing.options,
      }),
    });

    if (res.ok) {
      await fetchQuestions();
      setIsEditing(false);
      setEditing(null);
      setIsAdding(false);
    } else {
      alert("Failed to save question");
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
            className="underline underline-offset-4 font-semibold"
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
        <div className="border-b border-black w-full" />

        <main className="flex flex-1 overflow-hidden">
          <div className="w-1/3 p-4 border-r border-black overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Questions</h2>
              <button
                onClick={handleAddNew}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                + Add
              </button>
            </div>
            {questions.map((q) => (
              <div
                key={q.id}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  selected?.id === q.id
                    ? "bg-black text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelected(q);
                  setEditing(null);
                  setIsEditing(false);
                  setIsAdding(false);
                }}
              >
                {q.text}
              </div>
            ))}
          </div>

          <div className="w-2/3 p-6 overflow-y-auto">
            <QuestionEditor
              question={isEditing ? editing : selected}
              isEditing={isEditing}
              setEditing={setEditing}
              onEdit={() => {
                setEditing(JSON.parse(JSON.stringify(selected)));
                setIsEditing(true);
              }}
              onCancel={handleCancel}
              onSave={handleSave}
              onDelete={handleDelete}
              isNew={isAdding}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
