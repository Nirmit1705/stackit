import React, { useState } from 'react';
import { X } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import RichTextEditor from './RichTextEditor';
import { questionsAPI } from '../services/api';

interface AskQuestionPageProps {
  onNavigate: (page: string) => void;
  user: any;
}

const AskQuestionPage: React.FC<AskQuestionPageProps> = ({ onNavigate, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularTags = ['React', 'JavaScript', 'TypeScript', 'CSS', 'Python', 'API', 'Database', 'HTML'];

  // Redirect if not logged in
  if (!user.isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Login Required
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You need to be logged in to ask a question.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Back to home
        </button>
      </div>
    );
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput.trim());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || tags.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (title.length < 10) {
      setError('Title must be at least 10 characters long');
      return;
    }

    if (description.length < 20) {
      setError('Description must be at least 20 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await questionsAPI.createQuestion({
        title: title.trim(),
        description: description.trim(),
        tags: tags
      });

      if (response.success) {
        onNavigate('home');
      }
    } catch (error: any) {
      console.error('Failed to create question:', error);
      setError(error.response?.data?.message || 'Failed to create question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Ask Question' }
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Ask a Question</h1>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your programming question? Be specific."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
              required
              disabled={loading}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {title.length}/200 characters (minimum 10)
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Provide more details about your question. Include what you've tried and what you're expecting to happen."
              minHeightPx={256}
              disabled={loading}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Minimum 20 characters required
            </p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Maximum 5 tags)</span>
            </label>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add tags to describe your question (press Enter or comma to add)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={tags.length >= 5 || loading}
            />

            {/* Popular Tags */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    disabled={tags.includes(tag) || tags.length >= 5 || loading}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || tags.length === 0 || loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-lg transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                'Post Question'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionPage;