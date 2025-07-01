import React from "react";
import { motion } from "framer-motion";

const SWelcomeAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mt-4 px-4"
    >
      <h2 className="text-lg font-bold text-blue-600">Welcome to Shoehose</h2>
      <p className="text-sm text-gray-600 mt-1">Fast deliveries | Fresh Products</p>
    </motion.div>
  );
};

export default SWelcomeAnimation;
