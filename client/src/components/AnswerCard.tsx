import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import { Answer } from '../types';
import { mockUser } from '../data/mockData';

interface AnswerCardProps {
  answer: Answer;
  isQuestionOwner: boolean;
  user: any;
  onAccept: (answerId: string) => void;
  onVote: (answerId: string, type: 'up' | 'down') => void;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer, isQuestionOwner, user, onAccept, onVote }) => {
  const [isUserUpvoted, setIsUserUpvoted] = useState(answer.isUserUpvoted || false);
  const [isUserDownvoted, setIsUserDownvoted] = useState(answer.isUserDownvoted || false);

  const handleVote = (type: 'up' | 'down') => {
    if (!user.isLoggedIn) return;

    if (type === 'up') {
      setIsUserUpvoted(!isUserUpvoted);
      if (isUserDownvoted) setIsUserDownvoted(false);
    } else {
      setIsUserDownvoted(!isUserDownvoted);
      if (isUserUpvoted) setIsUserUpvoted(false);
    }
    onVote(answer.id, type);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 ${
      answer.isAccepted ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          <button
            onClick={() => handleVote('up')}
            disabled={!user.isLoggedIn}
            className={`p-2 rounded-full transition-colors ${
              isUserUpvoted
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            } ${!user.isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
            title={user.isLoggedIn ? 'Upvote' : 'Login to vote'}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {answer.upvotes - answer.downvotes}
          </span>
          
          <button
            onClick={() => handleVote('down')}
            disabled={!user.isLoggedIn}
            className={`p-2 rounded-full transition-colors ${
              isUserDownvoted
                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            } ${!user.isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
            title={user.isLoggedIn ? 'Downvote' : 'Login to vote'}
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          {/* Accept Answer Button */}
          {isQuestionOwner && user.isLoggedIn && (
            <button
              onClick={() => onAccept(answer.id)}
              className={`p-2 rounded-full transition-colors ${
                answer.isAccepted
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
              title={answer.isAccepted ? 'Accepted Answer' : 'Mark as Accepted'}
            >
              <Check className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Answer Content */}
        <div className="flex-1">
          {answer.isAccepted && (
            <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400 font-medium">
              <Check className="w-4 h-4" />
              Accepted Answer
            </div>
          )}

          <div
            className="prose prose-sm max-w-none text-gray-900 dark:text-gray-100 mb-4"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">{answer.username}</span>
              <span>•</span>
              <span>{answer.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;