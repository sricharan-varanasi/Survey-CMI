"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

type Props = {
  onNext: (userInfo: { name: string; age: string; gender: string }) => void;
};

export default function UserInfoScreen({ onNext }: Props) {
  const [step, setStep] = useState<"name" | "age" | "gender">("name");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("survey_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.name) {
        setName(parsed.name);
        setHasEnteredName(true);
        setStep("age");
      }
      if (parsed.age) setAge(parsed.age);
      if (parsed.gender) setGender(parsed.gender);
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem("survey_user", JSON.stringify({ name, age, gender }));
  }, [name, age, gender]);

  const handleNext = () => {
    if (step === "name" && name.trim() !== "") {
      setStep("age");
      setHasEnteredName(true);
    } else if (step === "age" && age.trim() !== "") {
      setStep("gender");
    } else if (step === "gender" && gender !== "") {
      const data = { name, age, gender };
      console.log("User Info:", data);
      onNext(data);
    }
  };

  const handleBack = () => {
    if (step === "age") {
      setStep("name");
      setHasEnteredName(false);
    } else if (step === "gender") {
      setStep("age");
    }
  };

  return (
    <div className="h-screen w-screen bg-black p-4 box-border">
      <div className="relative h-full w-full border-4 border-white rounded-xl grid grid-cols-1 md:grid-cols-2 items-center px-6 py-8 text-white">
        {/* Back Button (top-left) */}
        {step !== "name" && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-white hover:text-blue-400"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Left Image */}
        <div className="flex items-center justify-center md:justify-end pr-4">
          <motion.img
            key={hasEnteredName ? "after" : "before"}
            src={hasEnteredName ? "/profile.gif" : "/question.gif"}
            alt="Character"
            className="w-[90%] max-w-[550px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-start justify-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {hasEnteredName ? `Hi, ${name}` : "Let’s get to know you"}
          </h1>

          {step === "name" && (
            <>
              <label className="text-lg">Enter your name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-md bg-transparent border-2 border-white text-white placeholder-gray-400"
                placeholder="e.g. Sarah"
              />
              <button
                onClick={handleNext}
                disabled={name.trim() === ""}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            </>
          )}

          {step === "age" && (
            <>
              <label className="text-lg">Enter your age:</label>
              <input
                type="number"
                min={1}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 rounded-md bg-transparent border-2 border-white text-white placeholder-gray-400"
                placeholder="e.g. 21"
              />
              <button
                onClick={handleNext}
                disabled={age.trim() === ""}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            </>
          )}

          {step === "gender" && (
            <>
              <label className="text-lg">Select your gender:</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={gender === "M"}
                    onChange={(e) => setGender(e.target.value)}
                  />{" "}
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={gender === "F"}
                    onChange={(e) => setGender(e.target.value)}
                  />{" "}
                  Female
                </label>
              </div>
              <button
                onClick={handleNext}
                disabled={gender === ""}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 disabled:opacity-50"
              >
                Let’s get started
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
