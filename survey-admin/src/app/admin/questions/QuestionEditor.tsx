"use client";

import { Option, Question } from "./page";
import { Dispatch, SetStateAction } from "react";

interface Props {
  question: Question | null;
  isEditing: boolean;
  isNew: boolean;
  setEditing: Dispatch<SetStateAction<Question | null>>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function QuestionEditor({
  question,
  isEditing,
  isNew,
  setEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  if (!question) return null;

  const handleChange = (
    idx: number,
    key: "text" | "raw_score",
    value: string
  ) => {
    if (!isEditing || !setEditing || !question.options) return;
    const updatedOptions = [...question.options];
    if (key === "raw_score") {
      updatedOptions[idx].raw_score = parseInt(value);
    } else {
      updatedOptions[idx].text = value;
    }
    setEditing({ ...question, options: updatedOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Question
        </label>
        <input
          value={question.text}
          readOnly={!isEditing}
          onChange={(e) => setEditing({ ...question, text: e.target.value })}
          className={`w-full p-2 border border-black rounded text-black bg-white ${
            !isEditing ? "opacity-60 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold block mb-2">Options</label>
          {question.options.map((opt, idx) => (
            <input
              key={idx}
              value={opt.text}
              readOnly={!isEditing}
              onChange={(e) => handleChange(idx, "text", e.target.value)}
              className={`w-full mb-2 p-2 border border-gray-500 rounded ${
                !isEditing ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
          ))}
        </div>
        <div>
          <label className="text-sm font-semibold block mb-2">Raw Scores</label>
          {question.options.map((opt, idx) => (
            <input
              key={idx}
              type="number"
              value={opt.raw_score}
              readOnly={!isEditing}
              onChange={(e) => handleChange(idx, "raw_score", e.target.value)}
              className={`w-full mb-2 p-2 border border-gray-500 rounded ${
                !isEditing ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        {!isEditing ? (
          <>
            <button
              onClick={onEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {isNew ? "Add Question" : "Save"}
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
