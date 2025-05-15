"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // install lucide-react if not already

export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen bg-black p-4 box-border">
      <div className="h-full w-full border-4 border-white rounded-xl flex flex-col items-center justify-center text-white px-6">
        {/* Center GIF */}
        <motion.img
          src="/loading.gif"
          alt="Loading"
          className="w-[70%] max-w-[500px] mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Loading text with spinner */}
        <motion.div
          className="flex items-center gap-3 text-lg text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span>Please wait</span>
          <Loader2 className="animate-spin h-5 w-5 text-white" />
        </motion.div>
      </div>
    </div>
  );
}
