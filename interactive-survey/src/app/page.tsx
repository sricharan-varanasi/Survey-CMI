"use client";

import { useEffect, useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import UserInfoScreen from "@/components/UserInfoScreen";
import SurveyScreen from "@/components/SurveyScreen";
import EndScreen from "@/components/EndScreen";

export default function Home() {
  const [step, setStep] = useState<"welcome" | "userinfo" | "survey" | "end">(
    "welcome"
  );
  const [userInfo, setUserInfo] = useState({ name: "", age: "", gender: "" });

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem("survey_step");
    const savedUser = localStorage.getItem("survey_user");

    if (savedStep) setStep(savedStep as "welcome" | "userinfo" | "survey" | "end");
    if (savedUser) setUserInfo(JSON.parse(savedUser));
  }, []);

  // Save step/user to localStorage on changes
  useEffect(() => {
    localStorage.setItem("survey_step", step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem("survey_user", JSON.stringify(userInfo));
  }, [userInfo]);

  return (
    <>
      {step === "welcome" && (
        <WelcomeScreen onNext={() => setStep("userinfo")} />
      )}
      {step === "userinfo" && (
        <UserInfoScreen
          onNext={(info) => {
            setUserInfo(info);
            setStep("survey");
          }}
        />
      )}
      {step === "survey" && (
        <SurveyScreen
          userInfo={userInfo}
          onSubmit={() => {
            console.log("Survey completed by:", userInfo);
            setStep("end");
          }}
        />
      )}
      {step === "end" && <EndScreen onRestart={() => setStep("welcome")} />}
    </>
  );
}
