import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AskQuestionPage from './components/AskQuestionPage';
import QuestionDetailPage from './components/QuestionDetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [user, setUser] = useState({
    username: '',
    avatar: '',
    isLoggedIn: false
  });

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'question') {
      setSelectedQuestionId(null);
    }
  };

  const handleNavigateToQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentPage('question');
  };

  const handleLogin = (username: string, password: string) => {
    // Simulate login - in real app, this would call an API
    setUser({
      username,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      isLoggedIn: true
    });
  };

  const handleSignup = (username: string, email: string, password: string) => {
    // Simulate signup - in real app, this would call an API
    setUser({
      username,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      isLoggedIn: true
    });
  };

  const handleLogout = () => {
    setUser({
      username: '',
      avatar: '',
      isLoggedIn: false
    });
  };

  const handleVoteQuestion = (questionId: string, type: 'up' | 'down') => {
    // Handle question voting logic
    console.log(`Vote ${type} on question ${questionId}`);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigateToQuestion={handleNavigateToQuestion}
            onVoteQuestion={handleVoteQuestion}
            user={user}
          />
        );
      case 'ask':
        return <AskQuestionPage onNavigate={handleNavigate} />;
      case 'question':
        return selectedQuestionId ? (
          <QuestionDetailPage 
            questionId={selectedQuestionId} 
            onNavigate={handleNavigate} 
            user={user}
          />
        ) : (
          <HomePage 
            onNavigateToQuestion={handleNavigateToQuestion}
            onVoteQuestion={handleVoteQuestion}
            user={user}
          />
        );
      default:
        return (
          <HomePage 
            onNavigateToQuestion={handleNavigateToQuestion}
            onVoteQuestion={handleVoteQuestion}
            user={user}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          user={user}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onLogout={handleLogout}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;