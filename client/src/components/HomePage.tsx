import React, { useState } from 'react';
import { mockQuestions } from '../data/mockData';
import QuestionCard from './QuestionCard';
import { Question } from '../types';

interface HomePageProps {
  onNavigateToQuestion: (questionId: string) => void;
  onVoteQuestion: (questionId: string, type: 'up' | 'down') => void;
  user: any;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToQuestion, onVoteQuestion, user }) => {
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Questions List */}
      <div className="space-y-6">
        {currentQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onClick={() => onNavigateToQuestion(question.id)}
            onVote={onVoteQuestion}
            user={user}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;