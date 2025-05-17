"use client";

import { motion } from "framer-motion";

export default function LoginLoading() {
  return (
    <motion.div
      className="animate-gradient flex min-h-screen flex-col items-center justify-center gap-4 text-center text-lg font-medium text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className="mb-2 text-xl text-gray-600"
      >
        가장 쉽고, 간편하게 우리술과 가까워지는 방법
      </motion.span>

      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        className="text-5xl font-extrabold text-primary-600 drop-shadow-md"
      >
        "주라벨"
      </motion.span>
    </motion.div>
  );
}
