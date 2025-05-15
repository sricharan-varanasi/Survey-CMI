"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

type Props = {
  onSubmit: () => void;
};

export default function SurveyScreen({ onSubmit }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions/")
      .then((res) => res.json())
      .then((data: Question[]) => {
        setQuestions(data);
        setAnswers(Array(data.length).fill(""));
      });
  }, []);

  if (questions.length === 0)
    return <div className="text-white p-4">Loading...</div>;

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    const updated = [...answers];
    updated[currentIndex] = option;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      console.log("Final Answers:", answers);
      onSubmit();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goTo = (index: number) => setCurrentIndex(index);

  return (
    <div className="h-screen w-screen bg-black p-4 box-border">
      <div className="h-full w-full border-4 border-white rounded-xl flex flex-col justify-between px-6 py-6 text-white">
        {/* Top Navigation */}
        <div className="flex justify-center gap-2 mb-6">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-8 h-8 text-sm font-bold rounded-full flex items-center justify-center border-2 ${
                currentIndex === i
                  ? "bg-blue-600 border-blue-600"
                  : answers[i]
                  ? "border-green-400"
                  : "border-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Flashcard */}
        <motion.div
          key={currentQuestion.id}
          className="bg-transparent text-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto w-full text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.text)}
                className={`py-2 px-4 border rounded-md transition-all ${
                  answers[currentIndex] === option.text
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-transparent border-gray-400 hover:border-white hover:bg-white hover:text-black"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          {answers[currentIndex] && (
            <button
              onClick={() => handleOptionSelect("")}
              className="mt-4 text-sm text-red-400 underline hover:text-red-600"
            >
              Clear your answer
            </button>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 max-w-2xl mx-auto w-full">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-40"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className={`px-6 py-2 rounded ${
              answers[currentIndex]
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {currentIndex === questions.length - 1
              ? answers[currentIndex]
                ? "Submit your survey"
                : "Skip"
              : answers[currentIndex]
              ? "Next"
              : "Skip"}
          </button>
        </div>
      </div>
    </div>
  );
}
