"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import UserInfoScreen from "@/components/UserInfoScreen";
import SurveyScreen from "@/components/SurveyScreen";
import EndScreen from "@/components/EndScreen";

export default function Home() {
  const [step, setStep] = useState<"welcome" | "userinfo" | "survey" | "end">(
    "welcome"
  );
  const [userInfo, setUserInfo] = useState({ name: "", age: "", gender: "" });

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
