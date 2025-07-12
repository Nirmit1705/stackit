import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { questionsAPI, adminAPI } from '../services/api';
import QuestionCard from './QuestionCard';
import Pagination from './Pagination';
import { Question } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onNavigateToQuestion: (questionId: string) => void;
  user: any;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNavigateToQuestion, user }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

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

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: questionsPerPage,
        sort: filterOption === 'newest' ? 'newest' : filterOption === 'unanswered' ? 'unanswered' : 'newest'
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await questionsAPI.getQuestions(params);
      
      if (response.success) {
        // Transform API response to match frontend types
        const transformedQuestions = response.questions.map((q: any) => ({
          id: q._id,
          title: q.title,
          description: q.description,
          tags: q.tags,
          username: q.author.username,
          timestamp: formatTimestamp(q.createdAt),
          upvotes: q.voteCount,
          answers: [], // We'll load these on demand
          isUserUpvoted: false,
          isUserDownvoted: false
        }));

        setQuestions(transformedQuestions);
        setTotalPages(response.pagination.totalPages);
        setTotalQuestions(response.pagination.totalQuestions);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Fetch questions when dependencies change
  useEffect(() => {
    fetchQuestions();
  }, [currentPage, questionsPerPage, filterOption, searchQuery]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, filterOption]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!user.isLoggedIn || user.role !== 'admin') return;

    try {
      await adminAPI.deleteQuestion(questionId);
      // Refresh questions after deletion
      fetchQuestions();
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered by the useEffect when searchQuery changes
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading questions...</span>
        </div>
      </div>
    );
  }

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
          <option value="newest">Newest</option>
          <option value="unanswered">Unanswered</option>
          <option value="votes">Most Voted</option>
        </select>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </form>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {searchQuery ? 'No questions found' : 'No questions yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms or filters.' 
              : 'Be the first to ask a question!'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => onNavigate('ask')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Ask Question
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4 sm:space-y-6">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onClick={() => onNavigateToQuestion(question.id)}
                user={user}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalQuestions}
            itemsPerPage={questionsPerPage}
            startIndex={(currentPage - 1) * questionsPerPage}
            endIndex={Math.min(currentPage * questionsPerPage, totalQuestions)}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;