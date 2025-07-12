import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, Sun, Moon, Plus, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { mockUser, mockNotifications } from '../data/mockData';
import NotificationsDropdown from './NotificationsDropdown';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
  onLogin: (username: string, password: string) => void;
  onSignup: (username: string, email: string, password: string) => void;
  onLogout: () => void;
  onRoleChange: (role: 'user' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, user, onLogin, onSignup, onLogout, onRoleChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  useEffect(() => {
    if (!user.isLoggedIn) {
      setIsNotificationsOpen(false);
      setIsProfileModalOpen(false);
    }
  }, [user.isLoggedIn]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'user' | 'admin';
    onRoleChange(newRole);
    setShowRoleSelector(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              StackIt
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden">
            {/* Search Bar */}
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

            {/* Filter Dropdowns */}
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option>Newest</option>
                <option>Unanswered</option>
                <option>Most Voted</option>
              </select>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('ask')}
              className="hidden"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ask Question
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            {user.isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <NotificationsDropdown
                    notifications={notifications}
                    onClose={() => setIsNotificationsOpen(false)}
                    onMarkAllAsRead={handleMarkAllAsRead}
                  />
                )}
              </div>
            )}

            {/* Role Selector */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title="Change Role"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showRoleSelector && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  <select
                    value={user.role}
                    onChange={handleRoleChange}
                    className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {user.isLoggedIn ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                  {user.username}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* Mobile Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => onNavigate('ask')}
                  className="hidden"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ask Question
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </button>

                  {/* Notifications (Mobile) */}
                  {user.isLoggedIn && (
                    <div className="relative">
                      <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                  )}

                  {user.isLoggedIn ? (
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="flex items-center space-x-2"
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                      />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-blue-600 dark:text-blue-400 font-medium"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={onLogin}
        onSignup={onSignup}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={onLogout}
      />
    </header>
  );
};

export default Header;