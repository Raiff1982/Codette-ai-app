import React, { useState } from 'react';
import { X, Star, Send, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, darkMode }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);
  const [judgeInfo, setJudgeInfo] = useState({
    name: '',
    organization: '',
    role: ''
  });

  const categories = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare },
    { id: 'innovation', label: 'Innovation', icon: Star },
    { id: 'technical', label: 'Technical Excellence', icon: ThumbsUp },
    { id: 'ui', label: 'User Interface', icon: ThumbsDown },
    { id: 'performance', label: 'Performance', icon: Star }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API submission
    const feedbackData = {
      rating,
      feedback,
      category,
      judgeInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      // In a real app, this would send to your backend
      console.log('Judge Feedback Submitted:', feedbackData);
      
      // Store locally for demo purposes
      const existingFeedback = JSON.parse(localStorage.getItem('judgeFeedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('judgeFeedback', JSON.stringify(existingFeedback));
      
      setSubmitted(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setRating(0);
        setFeedback('');
        setJudgeInfo({ name: '', organization: '', role: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-md rounded-lg shadow-xl ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <div className="p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <ThumbsUp className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your feedback has been submitted successfully. This helps us improve Codette AI!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold flex items-center">
                  <Star className="mr-2 text-yellow-500" size={24} />
                  Judge Feedback
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-md ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Judge Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                    Judge Information (Optional)
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={judgeInfo.name}
                      onChange={(e) => setJudgeInfo(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    <input
                      type="text"
                      placeholder="Organization"
                      value={judgeInfo.organization}
                      onChange={(e) => setJudgeInfo(prev => ({ ...prev, organization: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g., Technical Judge, Industry Expert)"
                      value={judgeInfo.role}
                      onChange={(e) => setJudgeInfo(prev => ({ ...prev, role: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Overall Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 rounded ${
                          star <= rating ? 'text-yellow-500' : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-md border text-sm flex items-center justify-center transition-colors ${
                            category === cat.id
                              ? darkMode
                                ? 'bg-purple-900 border-purple-600 text-purple-200'
                                : 'bg-purple-100 border-purple-300 text-purple-800'
                              : darkMode
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <Icon size={16} className="mr-2" />
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts on Codette AI's innovation, technical implementation, user experience, or any other aspects..."
                    rows={4}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!feedback.trim() || rating === 0}
                  className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors ${
                    !feedback.trim() || rating === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Send size={16} className="mr-2" />
                  Submit Feedback
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your feedback helps us improve and will be reviewed by our team.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;