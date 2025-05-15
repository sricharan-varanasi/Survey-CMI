"use client";

import { motion } from "framer-motion";


type Props = {
  onNext: () => void;
};

export default function WelcomeScreen({ onNext }: Props) {
  return (
    <div className="h-screen w-screen bg-black p-4 box-border">
      <div className="h-full w-full border-4 border-white rounded-xl flex flex-col items-center justify-center text-white px-6">
        <motion.img
          src="/logo.gif"
          alt="Welcome"
          className="w-[70%] max-w-[500px] mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Welcome to the Survey
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300 mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Let’s get started...
        </motion.p>

        <motion.button
          onClick={onNext}
          className="mt-2.9 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start
        </motion.button>
      </div>
    </div>
  );
}
