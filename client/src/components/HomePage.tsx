import React, { useState, useEffect } from 'react';
import { mockQuestions } from '../data/mockData';
import QuestionCard from './QuestionCard';
import Pagination from './Pagination';
import { Question } from '../types';

interface HomePageProps {
  onNavigateToQuestion: (questionId: string) => void;
  onVoteQuestion: (questionId: string, type: 'up' | 'down') => void;
  user: any;
  onRequireLogin?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToQuestion, onVoteQuestion, user, onRequireLogin }) => {
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update questions per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust questions per page based on device size
  useEffect(() => {
    if (windowWidth < 640) { // Mobile
      setQuestionsPerPage(3);
    } else if (windowWidth < 1024) { // Tablet
      setQuestionsPerPage(4);
    } else { // Desktop
      setQuestionsPerPage(5);
    }
  }, [windowWidth]);

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Questions List */}
      <div className="space-y-4 sm:space-y-6">
        {currentQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onClick={() => onNavigateToQuestion(question.id)}
            onVote={onVoteQuestion}
            user={user}
            onRequireLogin={onRequireLogin}
          />
        ))}
      </div>

      {/* Responsive Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={questions.length}
        itemsPerPage={questionsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
};

export default HomePage;