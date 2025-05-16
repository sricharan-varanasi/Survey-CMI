"use client";

import { Subscale, Question } from "./SubscaleTypes";
import { Dispatch, SetStateAction } from "react";

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
  if (!subscale) return null;

  const toggleQuestion = (id: number) => {
    const current = subscale.question_ids;
    const updated = current.includes(id)
      ? current.filter((q) => q !== id)
      : [...current, id];
    setSubscale({ ...subscale, question_ids: updated });
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
