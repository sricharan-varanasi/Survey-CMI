"use client";

import { motion } from "framer-motion";

type Props = {
  onRestart: () => void;
};

export default function EndScreen({ onRestart }: Props) {
  return (
    <div className="h-screen w-screen bg-black p-4 box-border">
      <div className="h-full w-full border-4 border-white rounded-xl flex flex-col items-center justify-center text-white px-6">
        {/* Centered GIF */}
        <motion.img
          src="/celebrate.gif" // 🔁 Replace with your actual GIF file
          alt="Celebration"
          className="w-[70%] max-w-[500px] mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Thank-you text */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Thanks for completing the survey
        </motion.h1>

        {/* Retake Button */}
        <motion.button
          onClick={onRestart}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retake the survey
        </motion.button>
      </div>
    </div>
  );
}
