import React, { useState, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import AnswerCard from './AnswerCard';
import RichTextEditor from './RichTextEditor';
import { questionsAPI, answersAPI } from '../services/api';
import { Question, Answer } from '../types';

interface QuestionDetailPageProps {
  questionId: string;
  onNavigate: (page: string) => void;
  user: any;
}

const QuestionDetailPage: React.FC<QuestionDetailPageProps> = ({ questionId, onNavigate, user }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getQuestion(questionId);
      
      if (response.success) {
        // Transform API response to match frontend types
        const transformedQuestion = {
          id: response.question._id,
          title: response.question.title,
          description: response.question.description,
          tags: response.question.tags,
          username: response.question.author.username,
          timestamp: formatTimestamp(response.question.createdAt),
          upvotes: response.question.voteCount,
          answers: [],
          isUserUpvoted: false,
          isUserDownvoted: false
        };

        const transformedAnswers = response.question.answers.map((a: any) => ({
          id: a._id,
          content: a.content,
          username: a.author.username,
          timestamp: formatTimestamp(a.createdAt),
          upvotes: a.voteCount,
          downvotes: 0, // API doesn't separate upvotes/downvotes
          isAccepted: a.isAccepted,
          isUserUpvoted: a.userVote === 'up',
          isUserDownvoted: a.userVote === 'down'
        }));

        setQuestion(transformedQuestion);
        setAnswers(transformedAnswers);
      }
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerContent.trim() || !user.isLoggedIn) return;

    try {
      setSubmittingAnswer(true);
      const response = await questionsAPI.addAnswer(questionId, newAnswerContent);
      
      if (response.success) {
        const newAnswer: Answer = {
          id: response.answer._id,
          content: response.answer.content,
          username: response.answer.author.username,
          timestamp: 'just now',
          upvotes: 0,
          downvotes: 0,
          isAccepted: false,
          isUserUpvoted: false,
          isUserDownvoted: false
        };

        setAnswers([...answers, newAnswer]);
        setNewAnswerContent('');
      }
    } catch (error: any) {
      console.error('Failed to submit answer:', error);
      setError(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user.isLoggedIn) return;

    try {
      const response = await answersAPI.acceptAnswer(answerId);
      
      if (response.success) {
        setAnswers(answers.map(answer => ({
          ...answer,
          isAccepted: answer.id === answerId ? response.isAccepted : false
        })));
      }
    } catch (error: any) {
      console.error('Failed to accept answer:', error);
      setError(error.response?.data?.message || 'Failed to accept answer');
    }
  };

  const handleVoteAnswer = async (answerId: string, type: 'up' | 'down') => {
    if (!user.isLoggedIn) return;

    try {
      const response = await answersAPI.voteAnswer(answerId, type);
      
      if (response.success) {
        setAnswers(answers.map(answer => {
          if (answer.id === answerId) {
            return {
              ...answer,
              upvotes: response.voteCount,
              isUserUpvoted: response.userVote === 'up',
              isUserDownvoted: response.userVote === 'down'
            };
          }
          return answer;
        }));
      }
    } catch (error: any) {
      console.error('Failed to vote on answer:', error);
      setError(error.response?.data?.message || 'Failed to vote on answer');
    }
  };

  const handleDeleteAnswer = (answerId: string) => {
    setAnswers(answers.filter(answer => answer.id !== answerId));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading question...</p>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Question not found</h1>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => onNavigate('home')}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Back to home
        </button>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: question.title }
        ]}
      />

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Question Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div className="flex gap-6">
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

        <div className="space-y-6">
          {answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              isQuestionOwner={user.username === question.username}
              user={user}
              onAccept={handleAcceptAnswer}
              onVote={handleVoteAnswer}
              onDelete={handleDeleteAnswer}
            />
          ))}
        </div>
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
              minHeightPx={192}
              disabled={submittingAnswer}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newAnswerContent.trim() || submittingAnswer}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center"
              >
                {submittingAnswer ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  'Post Answer'
                )}
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