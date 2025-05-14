"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const surveyQuestions = [
  {
    id: "Q1",
    question: "How often do you feel anxious?",
    options: ["Never", "Rarely", "Sometimes", "Always"],
  },
  {
    id: "Q2",
    question: "How well do you sleep at night?",
    options: ["Very well", "Okay", "Poorly", "Terribly"],
  },
  {
    id: "Q3",
    question: "Do you feel energetic during the day?",
    options: ["Always", "Often", "Sometimes", "Never"],
  },
  {
    id: "Q4",
    question: "How often do you feel distracted?",
    options: ["Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: "Q5",
    question: "Do you find it easy to focus on tasks?",
    options: ["Very Easy", "Somewhat Easy", "Hard", "Very Hard"],
  },
];

type Props = {
  onSubmit: () => void;
};

export default function SurveyScreen({ onSubmit }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(surveyQuestions.length).fill("")
  );

  const currentQuestion = surveyQuestions[currentIndex];

  const handleOptionSelect = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = option;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex === surveyQuestions.length - 1) {
      console.log("Final Answers:", answers);
      onSubmit();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goTo = (index: number) => setCurrentIndex(index);

  return (
    <div className="h-screen w-screen bg-black p-4 box-border">
      <div className="h-full w-full border-4 border-white rounded-xl flex flex-col justify-between px-6 py-6 text-white">
        {/* Top Navigation */}
        <div className="flex justify-center gap-2 mb-6">
          {surveyQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-8 h-8 text-sm font-bold rounded-full flex items-center justify-center border-2
                ${
                  currentIndex === i
                    ? "bg-blue-600 border-blue-600 text-white"
                    : answers[i]
                    ? "border-green-400 text-white"
                    : "border-white text-white"
                }
              `}
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
          <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`py-2 px-4 border rounded-md transition-all ${
                  answers[currentIndex] === option
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-transparent border-gray-400 hover:border-white hover:bg-white hover:text-black"
                }`}
              >
                {option}
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
            {currentIndex === surveyQuestions.length - 1
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
