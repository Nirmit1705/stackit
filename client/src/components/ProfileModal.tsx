import React, { useState } from 'react';
import { X, User, Mail, Calendar, Award, MessageCircle, ThumbsUp } from 'lucide-react';
import { mockUser } from '../data/mockData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: mockUser.username,
    email: 'john.doe@example.com',
    bio: 'Full-stack developer passionate about React and TypeScript. Love helping others solve coding problems.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev'
  });

  if (!isOpen) return null;

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  const stats = {
    questionsAsked: 12,
    answersGiven: 34,
    upvotesReceived: 156,
    reputation: 1250
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Activity
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.username}
                  className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {editData.username}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Member since January 2024</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>{stats.reputation} reputation</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.questionsAsked}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.answersGiven}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Answers</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ThumbsUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.upvotesReceived}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Upvotes</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.reputation}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reputation</div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">{editData.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">{editData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">{editData.bio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">{editData.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editData.website}
                      onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <a
                      href={editData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {editData.website}
                    </a>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Asked a question</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">2 hours ago</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    How to implement dark mode in React applications?
                  </h4>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Answered a question</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">1 day ago</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Best practices for API error handling in frontend applications
                  </h4>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Received upvote</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">2 days ago</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Your answer was upvoted on "TypeScript vs JavaScript differences"
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;