import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import FeedbackModal from './FeedbackModal';

interface FeedbackButtonProps {
  darkMode: boolean;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ darkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-40 transition-all duration-300 ${
          darkMode
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-purple-500 hover:bg-purple-600 text-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageSquare size={24} />
        </motion.div>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          className={`absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-md text-sm whitespace-nowrap ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
          }`}
        >
          <div className="flex items-center">
            <Star size={14} className="mr-1 text-yellow-400" />
            Judge Feedback
          </div>
          <div className={`absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent ${
            darkMode ? 'border-l-gray-800' : 'border-l-gray-900'
          }`}></div>
        </motion.div>
      </motion.button>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        darkMode={darkMode}
      />
    </>
  );
};

export default FeedbackButton;