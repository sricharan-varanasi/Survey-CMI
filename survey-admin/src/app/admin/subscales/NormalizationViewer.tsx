"use client";

import { useEffect, useState } from "react";

interface Props {
  subscaleId: number;
  subscaleName: string;
  onBack: () => void;
}

interface NormalizationRow {
  age: number;
  sex: string;
  raw_score: number;
  normalized_score: number;
}

export default function NormalizationViewer({
  subscaleId,
  subscaleName,
  onBack,
}: Props) {
  const [rows, setRows] = useState<NormalizationRow[]>([]);

  useEffect(() => {
    const fetchTable = async () => {
      const res = await fetch(
        `https://survey-cmi.site/subscales/${subscaleId}/normalization-table/`
      );
      const data = await res.json();
      setRows(data);
    };
    fetchTable();
  }, [subscaleId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-black">
          Normalization Table of "{subscaleName}"
        </h2>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border border-black text-sm text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Age</th>
              <th className="border px-2 py-1">Sex</th>
              <th className="border px-2 py-1">Raw Score</th>
              <th className="border px-2 py-1">Normalized Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 20).map((row, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1 text-center">{row.age}</td>
                <td className="border px-2 py-1 text-center">{row.sex}</td>
                <td className="border px-2 py-1 text-center">
                  {row.raw_score}
                </td>
                <td className="border px-2 py-1 text-center">
                  {row.normalized_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 20 && (
          <p className="text-xs text-gray-600 mt-2">
            Showing first 20 rows only.
          </p>
        )}
      </div>
    </div>
  );
}
