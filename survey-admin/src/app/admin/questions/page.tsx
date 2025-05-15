"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Option = {
  id: number;
  text: string;
  raw_score: number;
};

type Question = {
  id: number;
  text: string;
  options: Option[];
};

export default function QuestionsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [original, setOriginal] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleInputChange = (
    index: number,
    key: "text" | "raw_score",
    value: string
  ) => {
    if (!selected) return;
    const updatedOptions = [...selected.options];
    if (key === "raw_score") {
      updatedOptions[index].raw_score = parseInt(value);
    } else {
      updatedOptions[index].text = value;
    }
    setSelected({ ...selected, options: updatedOptions });
  };

  const handleSave = async () => {
    if (!selected) return;
    const res = await fetch(
      `https://survey-cmi.site/questions/${selected.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selected.text,
          options: selected.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            raw_score: opt.raw_score,
          })),
        }),
      }
    );

    if (res.ok) {
      await fetchQuestions();
      setIsEditing(false);
      setOriginal(null);
    } else {
      alert("Failed to save changes.");
    }
  };

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

        {/* Title */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-black">
            Survey Administrator
          </h1>
        </div>

        {/* Navigation */}
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

        {/* Main content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 p-4 border-r border-black overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Questions</h2>
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
                  setOriginal(q);
                  setIsEditing(false);
                }}
              >
                {q.text}
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="w-2/3 p-6 space-y-4 overflow-y-auto">
            {selected && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Question
                  </label>
                  <input
                    value={selected.text}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setSelected({ ...selected, text: e.target.value })
                    }
                    className={`w-full p-2 border border-black rounded text-black bg-white ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">
                      Options
                    </label>
                    {selected.options.map((opt, idx) => (
                      <input
                        key={opt.id}
                        value={opt.text}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleInputChange(idx, "text", e.target.value)
                        }
                        className={`w-full mb-2 p-2 border border-gray-500 rounded ${
                          !isEditing ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-2">
                      Raw Scores
                    </label>
                    {selected.options.map((opt, idx) => (
                      <input
                        key={opt.id}
                        type="number"
                        value={opt.raw_score}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleInputChange(idx, "raw_score", e.target.value)
                        }
                        className={`w-full mb-2 p-2 border border-gray-500 rounded ${
                          !isEditing ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-4 mt-4">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setOriginal(selected);
                          setIsEditing(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>
                      <button className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Delete Question
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          if (original) {
                            setSelected(original);
                          }
                          setIsEditing(false);
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
