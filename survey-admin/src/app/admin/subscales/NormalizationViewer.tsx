"use client";

import { useEffect, useState } from "react";

/**
 * Lightweight viewer that displays the normalization lookup table for a single sub‑scale.
 * It fetches rows every time the caller switches the selected sub‑scale.
 */

type Props = {
  /** id of the sub‑scale whose table we want to view */
  subscaleId: number;
  /** name of the sub‑scale – purely for UI display */
  subscaleName: string;
  /** callback used by the back button */
  onBack: () => void;
};

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://survey-cmi.site/subscales/${subscaleId}/normalization-table/`
        );
        const data: NormalizationRow[] = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load normalization table");
      } finally {
        setLoading(false);
      }
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

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-auto max-h-[70vh]">
          <table className="min-w-full border border-black text-sm text-black">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border px-2 py-1">Age</th>
                <th className="border px-2 py-1">Sex</th>
                <th className="border px-2 py-1">Raw Score</th>
                <th className="border px-2 py-1">Normalized Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`${row.age}-${row.sex}-${row.raw_score}-${idx}`}>
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
          {rows.length === 0 && (
            <p className="text-gray-600 mt-2">
              No data found for this sub‑scale.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
