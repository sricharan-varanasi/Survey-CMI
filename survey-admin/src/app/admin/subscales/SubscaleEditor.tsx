"use client";

import { Subscale, Question } from "./SubscaleTypes";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  subscale: Subscale | null;
  isEditing: boolean;
  isNew: boolean;
  questions: Question[];
  setSubscale: Dispatch<SetStateAction<Subscale | null>>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function SubscaleEditor({
  subscale,
  isEditing,
  isNew,
  questions,
  setSubscale,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  if (!subscale) return null;

  const toggleQuestion = (id: number) => {
    const updated = subscale.question_ids.includes(id)
      ? subscale.question_ids.filter((q) => q !== id)
      : [...subscale.question_ids, id];
    setSubscale({ ...subscale, question_ids: updated });
  };

  const handleFileUpload = async () => {
    if (!csvFile || !subscale.id) return;
    const formData = new FormData();
    formData.append("file", csvFile);
    const res = await fetch(
      `https://survey-cmi.site/subscales/${subscale.id}/upload-normalization/`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.ok) {
      alert("Normalization table uploaded successfully.");
      setCsvFile(null);
    } else {
      alert("Upload failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Subscale Name
        </label>
        <input
          value={subscale.name}
          readOnly={!isEditing}
          onChange={(e) => setSubscale({ ...subscale, name: e.target.value })}
          className={`w-full p-2 border border-black rounded text-black bg-white ${
            !isEditing ? "opacity-60 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Scoring Method
        </label>
        <select
          disabled={!isEditing}
          value={subscale.method}
          onChange={(e) =>
            setSubscale({
              ...subscale,
              method: e.target.value as "sum" | "average",
            })
          }
          className="w-full p-2 border border-black rounded"
        >
          <option value="sum">Sum</option>
          <option value="average">Average</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Select Questions
        </label>
        <div className="space-y-2">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center">
              <input
                type="checkbox"
                disabled={!isEditing}
                checked={subscale.question_ids.includes(q.id)}
                onChange={() => toggleQuestion(q.id)}
                className="mr-2"
              />
              <span>{q.text}</span>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-1">
            Upload Normalization Table (.csv)
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => document.getElementById("csvInput")?.click()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Choose File
            </button>
            <span className="text-sm text-gray-700">
              {csvFile ? csvFile.name : "No file chosen"}
            </span>
          </div>

          <input
            id="csvInput"
            type="file"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files) setCsvFile(e.target.files[0]);
            }}
            className="hidden"
          />

          {csvFile && subscale.id && (
            <div className="mt-2">
              <button
                onClick={handleFileUpload}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                Upload CSV
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-6">
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {isNew ? "Add Subscale" : "Save"}
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
