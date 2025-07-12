import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import AnswerCard from './AnswerCard';
import RichTextEditor from './RichTextEditor';
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

  const handleDeleteAnswer = (answerId: string) => {
    setAnswers(answers.filter(answer => answer.id !== answerId));
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