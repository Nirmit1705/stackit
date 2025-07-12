import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import AnswerCard from './AnswerCard';
import RichTextEditor from './RichTextEditor';
import Pagination from './Pagination';
import { mockQuestions, mockUser } from '../data/mockData';
import { Question, Answer } from '../types';

interface QuestionDetailPageProps {
  questionId: string;
  onNavigate: (page: string) => void;
  user: any;
}

const QuestionDetailPage: React.FC<QuestionDetailPageProps> = ({ questionId, onNavigate, user }) => {
  const question = mockQuestions.find(q => q.id === questionId);
  const [answers, setAnswers] = useState<Answer[]>(question?.answers || []);
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [questionVote, setQuestionVote] = useState<'up' | 'down' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [answersPerPage, setAnswersPerPage] = useState(3);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update answers per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust answers per page based on device size
  useEffect(() => {
    if (windowWidth < 640) { // Mobile
      setAnswersPerPage(2);
    } else if (windowWidth < 1024) { // Tablet
      setAnswersPerPage(3);
    } else { // Desktop
      setAnswersPerPage(4);
    }
  }, [windowWidth]);

  // Reset to first page when answers change
  useEffect(() => {
    setCurrentPage(1);
  }, [answers.length]);

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Question not found</h1>
        <button
          onClick={() => onNavigate('home')}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Back to home
        </button>
      </div>
    );
  }

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerContent.trim() || !user.isLoggedIn) return;

    const newAnswer: Answer = {
      id: Date.now().toString(),
      content: newAnswerContent,
      username: user.username,
      timestamp: 'just now',
      upvotes: 0,
      downvotes: 0,
      isAccepted: false
    };

    setAnswers([...answers, newAnswer]);
    setNewAnswerContent('');
  };

  const handleAcceptAnswer = (answerId: string) => {
    setAnswers(answers.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId ? !answer.isAccepted : false
    })));
  };

  const handleVoteAnswer = (answerId: string, type: 'up' | 'down') => {
    // Handle voting logic here
    console.log(`Vote ${type} on answer ${answerId}`);
  };

  const handleQuestionVote = (voteType: 'up' | 'down') => {
    if (!user.isLoggedIn) return;
    
    if (questionVote === voteType) {
      // If clicking the same vote, remove it
      setQuestionVote(null);
    } else {
      // Set the new vote
      setQuestionVote(voteType);
    }
  };

  // Calculate vote count
  const getVoteCount = () => {
    let count = question.upvotes;
    if (questionVote === 'up') count += 1;
    if (questionVote === 'down') count -= 1;
    return count;
  };

  // Pagination for answers
  const totalPages = Math.ceil(answers.length / answersPerPage);
  const startIndex = (currentPage - 1) * answersPerPage;
  const endIndex = startIndex + answersPerPage;
  const currentAnswers = answers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: question.title }
        ]}
      />

      {/* Question Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div className="flex gap-6">
          {/* Question Voting */}
          <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <button
              onClick={() => handleQuestionVote('up')}
              disabled={!user.isLoggedIn}
              className={`p-2 rounded transition-colors ${
                questionVote === 'up'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
              } ${!user.isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
              title={user.isLoggedIn ? 'Upvote' : 'Login to vote'}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100 py-1">
              {getVoteCount()}
            </span>

            <button
              onClick={() => handleQuestionVote('down')}
              disabled={!user.isLoggedIn}
              className={`p-2 rounded transition-colors ${
                questionVote === 'down'
                  ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
              } ${!user.isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
              title={user.isLoggedIn ? 'Downvote' : 'Login to vote'}
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {question.title}
            </h1>

            <div
              className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100 mb-6"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Question Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{question.username}</span>
                <span>•</span>
                <span>{question.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>

        {answers.length > 0 ? (
          <>
            <div className="space-y-6">
              {currentAnswers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  isQuestionOwner={user.username === question.username}
                  user={user}
                  onAccept={handleAcceptAnswer}
                  onVote={handleVoteAnswer}
                />
              ))}
            </div>

            {/* Pagination for Answers */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={answers.length}
              itemsPerPage={answersPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No answers yet. Be the first to answer this question!
            </p>
          </div>
        )}
      </div>

      {/* Answer Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Your Answer</h3>

        {user.isLoggedIn ? (
          <form onSubmit={handleSubmitAnswer} className="space-y-6">
            <RichTextEditor
              value={newAnswerContent}
              onChange={setNewAnswerContent}
              placeholder="Write your answer here. Be specific and helpful."
              minHeight="min-h-48"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newAnswerContent.trim()}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Post Answer
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You need to be logged in to post an answer.
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;