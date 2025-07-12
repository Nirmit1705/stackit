import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { mockQuestions } from '../data/mockData';
import QuestionCard from './QuestionCard';
import Pagination from './Pagination';
import { Question } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onNavigateToQuestion: (questionId: string) => void;
  user: any;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNavigateToQuestion, user }) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('Newest');
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

  // Apply search and filter
  const processedQuestions = useMemo(() => {
    let result = questions;

    // Search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(q =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query)
      );
    }

    // Filter Option
    switch (filterOption) {
      case 'Unanswered':
        result = result.filter(q => q.answers.length === 0);
        break;
      case 'Newest':
      default:
        // Assuming mock data is already ordered by newest first
        break;
    }

    return result;
  }, [questions, searchQuery, filterOption]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterOption]);

  const totalPages = Math.ceil(processedQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = processedQuestions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteQuestion = (questionId: string) => {
    // In a real app, this would call an API
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        {/* Ask Question */}
        <button
          onClick={() => onNavigate('ask')}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ask Question
        </button>

        {/* Filter */}
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option>Newest</option>
          <option>Unanswered</option>
        </select>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>
      {/* Questions List */}
      <div className="space-y-4 sm:space-y-6">
        {currentQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onClick={() => onNavigateToQuestion(question.id)}
            user={user}
            onDelete={handleDeleteQuestion}  // Add this prop
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