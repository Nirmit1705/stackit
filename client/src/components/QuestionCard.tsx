import React from 'react';
import { ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
  onVote: (questionId: string, type: 'up' | 'down') => void;
  user: any;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick, onVote, user }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleVote = (e: React.MouseEvent, type: 'up' | 'down') => {
    e.stopPropagation();
    if (user.isLoggedIn) {
      onVote(question.id, type);
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
          <button
            onClick={(e) => handleVote(e, 'up')}
            disabled={!user.isLoggedIn}
            className={`p-1 rounded-full transition-colors ${
              question.isUserUpvoted
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            } ${!user.isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
            title={user.isLoggedIn ? 'Upvote' : 'Login to vote'}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {question.upvotes}
          </span>
          
          <button
            onClick={(e) => handleVote(e, 'down')}
            disabled={!user.isLoggedIn}
            className={`p-1 rounded-full transition-colors ${
              question.isUserDownvoted
                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            } ${!user.isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
            title={user.isLoggedIn ? 'Downvote' : 'Login to vote'}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Question Content */}
        <div className="flex-1" onClick={onClick}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {question.title}
          </h3>
      
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {truncateText(question.description, 150)}
          </p>
      
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
      
          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{question.answers.length}</span>
              </div>
            </div>
          
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">{question.username}</span>
              <span>•</span>
              <span>{question.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;