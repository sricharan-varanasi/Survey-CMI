"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";

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
  userInfo: { name: string; age: string; gender: string };
  onSubmit: () => void;
};

export default function SurveyScreen({ userInfo, onSubmit }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    // Fetch questions once
    fetch("https://survey-cmi.site/questions/")
      .then((res) => res.json())
      .then((data: Question[]) => {
        const savedAnswers = localStorage.getItem("survey_answers");
        const savedIndex = localStorage.getItem("survey_index");

        setQuestions(data);
        setAnswers(
          savedAnswers ? JSON.parse(savedAnswers) : Array(data.length).fill("")
        );
        setCurrentIndex(
          savedIndex ? Math.min(parseInt(savedIndex), data.length - 1) : 0
        );
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem("survey_answers", JSON.stringify(answers));
      localStorage.setItem("survey_index", currentIndex.toString());
    }
  }, [answers, currentIndex, questions.length]);

  if (questions.length === 0) return <LoadingScreen />;

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    const updated = [...answers];
    updated[currentIndex] = option;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      const submission = {
        user: {
          name: userInfo.name,
          age: parseInt(userInfo.age),
          gender: userInfo.gender,
        },
        responses: questions.map((q, i) => {
          const selected = answers[i];
          const matched = q.options.find((opt) => opt.text === selected);
          return {
            question_id: q.id,
            answer: selected,
            raw_score: matched ? matched.raw_score : 0,
          };
        }),
      };

      fetch("https://survey-cmi.site/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
        .then((res) => res.json())
        .then(() => {
          localStorage.clear(); // Clear all saved progress
          onSubmit();
        })
        .catch((err) => {
          console.error("Submission failed:", err);
        });
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
