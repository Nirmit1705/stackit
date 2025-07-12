import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AskQuestionPage from './components/AskQuestionPage';
import QuestionDetailPage from './components/QuestionDetailPage';
import { authAPI, userAPI, getToken } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [user, setUser] = useState({
    _id: '',
    username: '',
    email: '',
    avatarUrl: '',
    isLoggedIn: false,
    role: 'user' as 'user' | 'admin'
  });
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await userAPI.getProfile();
          if (response.success) {
            setUser({
              _id: response.user._id,
              username: response.user.username,
              email: response.user.email,
              avatarUrl: response.user.avatarUrl,
              isLoggedIn: true,
              role: response.user.role
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token is invalid, remove it
          authAPI.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

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

  const handleLogin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        setUser({
          _id: response.user._id,
          username: response.user.username,
          email: response.user.email,
          avatarUrl: response.user.avatarUrl,
          isLoggedIn: true,
          role: response.user.role
        });
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const handleSignup = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authAPI.signup(username, email, password);
      if (response.success) {
        setUser({
          _id: response.user._id,
          username: response.user.username,
          email: response.user.email,
          avatarUrl: response.user.avatarUrl,
          isLoggedIn: true,
          role: response.user.role
        });
        return { success: true };
      }
      return { success: false, message: 'Signup failed' };
    } catch (error: any) {
      console.error('Signup failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed. Please try again.' 
      };
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser({
      _id: '',
      username: '',
      email: '',
      avatarUrl: '',
      isLoggedIn: false,
      role: 'user'
    });
    setCurrentPage('home');
  };

  const handleRoleChange = (role: 'user' | 'admin') => {
    setUser(prev => ({
      ...prev,
      role: role
    }));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate}
            onNavigateToQuestion={handleNavigateToQuestion}
            user={user}
          />
        );
      case 'ask':
        return <AskQuestionPage onNavigate={handleNavigate} user={user} />;
      case 'question':
        return selectedQuestionId ? (
          <QuestionDetailPage 
            questionId={selectedQuestionId} 
            onNavigate={handleNavigate} 
            user={user}
          />
        ) : (
          <HomePage 
            onNavigate={handleNavigate}
            onNavigateToQuestion={handleNavigateToQuestion}
            user={user}
          />
        );
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate}
            onNavigateToQuestion={handleNavigateToQuestion}
            user={user}
          />
        );
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

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
          onRoleChange={handleRoleChange}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;