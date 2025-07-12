import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
  onVote: (questionId: string, type: 'up' | 'down') => void;
  user: any;
  onRequireLogin?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-2xl border-l-4 border-blue-400 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 px-4 sm:px-7 py-4 sm:py-5 mb-6 sm:mb-7 flex flex-col transition-all duration-200 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 cursor-pointer font-sans"
      onClick={onClick}
    >
      {/* Top: Title, then Answer Count (stacked on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
        <div className="flex flex-col flex-1 min-w-0">
         <h3 className="text-lg font-semibold font-sans text-gray-900 dark:text-gray-100 mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {question.title}
          </h3>
          {/* On mobile, answer badge below title */}
          <div className="flex sm:hidden mt-1">
            <span className="rounded-xl border-2 border-blue-300 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 px-3 py-1 text-sm font-medium shadow-sm whitespace-nowrap font-sans">
              {question.answers.length} ans
            </span>
          </div>
        </div>
        {/* On desktop, answer badge right-aligned */}
        <div className="hidden sm:flex items-center sm:ml-4">
          <span className="rounded-xl border-2 border-blue-300 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 px-4 py-1 text-base font-medium shadow-sm whitespace-nowrap font-sans">
            {question.answers.length} ans
          </span>
        </div>
      </div>
      {/* Tags, then Description (stacked on mobile) */}
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 mt-2 mb-2">
        <div className="flex flex-wrap gap-2 mb-1 sm:mb-2 w-full sm:w-auto">
          {question.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 border border-blue-200 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-xs rounded-lg font-medium shadow-sm font-sans"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex-1 min-w-0 w-full mt-1 sm:mt-0">
          <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed font-normal break-words font-sans">
            {truncateText(question.description, 180)}
          </p>
        </div>
      </div>
      {/* Bottom Row: Username */}
      <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal font-sans">
        {question.username}
      </div>
    </div>
  );
};

export default QuestionCard;