import { Question, Notification, User } from '../types';

export const mockUser: User = {
  username: 'john_doe',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
  isLoggedIn: true
};

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to implement dark mode in React applications?',
    description: 'I\'m looking for the best practices to implement a dark mode toggle in my React application. Should I use CSS variables or a state management solution?',
    tags: ['React', 'CSS', 'Dark Mode'],
    username: 'sarah_dev',
    timestamp: '2 hours ago',
    upvotes: 15,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: [
      {
        id: 'a1',
        content: 'You can use CSS custom properties (variables) combined with a React context for theme management. This approach is clean and performant.',
        username: 'mike_frontend',
        timestamp: '1 hour ago',
        upvotes: 8,
        downvotes: 0,
        isAccepted: true
      }
    ]
  },
  {
    id: '2',
    title: 'What are the differences between TypeScript and JavaScript?',
    description: 'I\'m new to programming and confused about when to use TypeScript vs JavaScript. Can someone explain the key differences?',
    tags: ['TypeScript', 'JavaScript', 'Beginner'],
    username: 'newbie_coder',
    timestamp: '4 hours ago',
    upvotes: 23,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '3',
    title: 'Best practices for API error handling in frontend applications',
    description: 'How should I handle different types of API errors (network errors, 404, 500, etc.) in a user-friendly way?',
    tags: ['API', 'Error Handling', 'Frontend'],
    username: 'api_master',
    timestamp: '1 day ago',
    upvotes: 31,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: [
      {
        id: 'a2',
        content: 'Implement a centralized error handling system with try-catch blocks and user-friendly error messages.',
        username: 'error_guru',
        timestamp: '18 hours ago',
        upvotes: 12,
        downvotes: 1,
        isAccepted: false
      }
    ]
  },
  {
    id: '4',
    title: 'How to optimize React app performance?',
    description: 'My React application is getting slower as it grows. What are some techniques to improve performance?',
    tags: ['React', 'Performance', 'Optimization'],
    username: 'perf_seeker',
    timestamp: '2 days ago',
    upvotes: 45,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    message: 'mike_frontend answered your question about dark mode',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: '2',
    type: 'mention',
    message: 'You were mentioned in a comment by @sarah_dev',
    timestamp: '3 hours ago',
    isRead: false
  },
  {
    id: '3',
    type: 'comment',
    message: 'Someone commented on your answer',
    timestamp: '1 day ago',
    isRead: true
  }
];