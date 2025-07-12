export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  username: string;
  timestamp: string;
  upvotes: number;
  answers: Answer[];
  isUserUpvoted?: boolean;
  isUserDownvoted?: boolean;
}

export interface Answer {
  id: string;
  content: string;
  username: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  isUserUpvoted?: boolean;
  isUserDownvoted?: boolean;
}

export interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'mention';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface User {
  username: string;
  avatar: string;
  isLoggedIn: boolean;
}