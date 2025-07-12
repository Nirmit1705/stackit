import { Question, Notification, User } from '../types';

export const mockUser: User = {
  username: 'john_doe',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
  isLoggedIn: true,
  role: 'user'
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
      },
      {
        id: 'a2',
        content: 'I recommend using a library like styled-components or emotion for theme management. They provide excellent TypeScript support and make theme switching very smooth.',
        username: 'theme_expert',
        timestamp: '45 minutes ago',
        upvotes: 5,
        downvotes: 1,
        isAccepted: false
      },
      {
        id: 'a3',
        content: 'For a simple implementation, you can use localStorage to persist the user\'s theme preference. Here\'s a basic example with React hooks.',
        username: 'local_storage_guru',
        timestamp: '30 minutes ago',
        upvotes: 3,
        downvotes: 0,
        isAccepted: false
      },
      {
        id: 'a4',
        content: 'Consider using Tailwind CSS with its dark mode utilities. It makes implementing dark mode much easier with utility classes.',
        username: 'tailwind_fan',
        timestamp: '20 minutes ago',
        upvotes: 7,
        downvotes: 2,
        isAccepted: false
      },
      {
        id: 'a5',
        content: 'Don\'t forget about accessibility! Make sure your dark mode implementation meets WCAG guidelines for color contrast.',
        username: 'a11y_advocate',
        timestamp: '15 minutes ago',
        upvotes: 4,
        downvotes: 0,
        isAccepted: false
      },
      {
        id: 'a6',
        content: 'I\'ve found that using CSS custom properties with a React context is the most maintainable approach. It keeps your styling logic centralized.',
        username: 'css_master',
        timestamp: '10 minutes ago',
        upvotes: 2,
        downvotes: 0,
        isAccepted: false
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
      },
      {
        id: 'a7',
        content: 'Use axios interceptors to handle common error patterns globally. This keeps your component code clean.',
        username: 'axios_expert',
        timestamp: '16 hours ago',
        upvotes: 8,
        downvotes: 0,
        isAccepted: false
      },
      {
        id: 'a8',
        content: 'Create custom error classes for different types of errors (NetworkError, ValidationError, etc.) to provide better error handling.',
        username: 'error_architect',
        timestamp: '14 hours ago',
        upvotes: 6,
        downvotes: 1,
        isAccepted: false
      },
      {
        id: 'a9',
        content: 'Don\'t forget to handle loading states and show appropriate feedback to users during API calls.',
        username: 'ux_focused',
        timestamp: '12 hours ago',
        upvotes: 9,
        downvotes: 0,
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
  },
  {
    id: '5',
    title: 'Understanding React hooks and their lifecycle',
    description: 'Can someone explain the difference between useEffect, useMemo, and useCallback? When should I use each one?',
    tags: ['React', 'Hooks', 'useEffect'],
    username: 'hook_explorer',
    timestamp: '3 days ago',
    upvotes: 28,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '6',
    title: 'How to implement infinite scrolling in React?',
    description: 'I want to implement infinite scrolling for a list of items. What\'s the best approach using React?',
    tags: ['React', 'Infinite Scroll', 'Performance'],
    username: 'scroll_master',
    timestamp: '4 days ago',
    upvotes: 19,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '7',
    title: 'State management with Redux Toolkit vs Zustand',
    description: 'I\'m starting a new project and can\'t decide between Redux Toolkit and Zustand. What are the pros and cons?',
    tags: ['Redux', 'Zustand', 'State Management'],
    username: 'state_architect',
    timestamp: '5 days ago',
    upvotes: 37,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '8',
    title: 'Testing React components with Jest and React Testing Library',
    description: 'What are the best practices for testing React components? How do I test user interactions?',
    tags: ['React', 'Testing', 'Jest'],
    username: 'test_driver',
    timestamp: '6 days ago',
    upvotes: 22,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '9',
    title: 'How to handle authentication in React applications?',
    description: 'I need to implement user authentication in my React app. What\'s the most secure approach?',
    tags: ['React', 'Authentication', 'Security'],
    username: 'auth_guru',
    timestamp: '1 week ago',
    upvotes: 41,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '10',
    title: 'Building responsive layouts with CSS Grid and Flexbox',
    description: 'What\'s the difference between CSS Grid and Flexbox? When should I use each one for responsive design?',
    tags: ['CSS', 'Grid', 'Flexbox'],
    username: 'layout_master',
    timestamp: '1 week ago',
    upvotes: 33,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '11',
    title: 'How to implement real-time features with WebSockets?',
    description: 'I want to add real-time chat functionality to my app. How do I implement WebSockets with React?',
    tags: ['WebSockets', 'Real-time', 'React'],
    username: 'realtime_dev',
    timestamp: '1 week ago',
    upvotes: 26,
    isUserUpvoted: false,
    isUserDownvoted: false,
    answers: []
  },
  {
    id: '12',
    title: 'Optimizing bundle size in React applications',
    description: 'My React app bundle is getting too large. What techniques can I use to reduce the bundle size?',
    tags: ['React', 'Bundle Size', 'Optimization'],
    username: 'bundle_optimizer',
    timestamp: '2 weeks ago',
    upvotes: 29,
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