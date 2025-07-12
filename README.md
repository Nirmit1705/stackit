# StackIt – A Minimal Q&A Forum Platform

**StackIt** is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It's designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

## Team

**Team Name:** Golden Quadrilateral  
**Team Members:**   
Prem Kotadiya - 23it048@charusat.edu.in  
Prajesh Majithiya - 23it054@charusat.edu.in  
Jeel Vipulkumar Patel - 23it081@charusat.edu.in  
Nirmit Patel - 23it087@charusat.edu.in (Team lead)

## Features

### Core Features
- **Ask Questions**: Users can post detailed questions with rich text formatting
- **Answer Questions**: Community members can provide helpful answers
- **Vote System**: Upvote/downvote questions and answers for quality control
- **Accept Answers**: Question authors can mark the best answer as accepted
- **Tag System**: Organize questions with relevant tags for easy discovery
- **Search & Filter**: Find questions by keywords, tags, or filter criteria
- **User Authentication**: Secure signup/login system with JWT tokens
- **User Profiles**: Personal profiles with activity tracking and statistics

### Advanced Features
- **Real-time Notifications**: Get notified about answers, votes, and mentions
- **Admin Dashboard**: Administrative tools for content moderation
- **Rich Text Editor**: Format questions and answers with markdown support
- **Image Upload**: Include images in questions and answers via Cloudinary
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Role-based Access**: User and admin roles with different permissions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Quill** for rich text editing
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **DOMPurify** for HTML sanitization
- **bcryptjs** for password hashing
- **Express Rate Limit** for API protection

## Project Structure

```
stackit/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Theme, etc.)
│   │   ├── data/          # Mock data for development
│   │   ├── services/      # API service layer
│   │   ├── styles/        # CSS and styling files
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/        # Database and app configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # MongoDB/Mongoose models
│   │   ├── routes/        # API route handlers
│   │   └── server.js      # Main server file
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

### Database Setup

1. Make sure MongoDB is running on your system
2. The application will automatically create the required collections
3. Optional: Import sample data for testing

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### User Endpoints
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:id/stats` - Get user statistics

### Question Endpoints
- `GET /api/questions` - Get all questions (with pagination)
- `GET /api/questions/:id` - Get single question with answers
- `POST /api/questions` - Create new question
- `POST /api/questions/:id/answers` - Add answer to question

### Answer Endpoints
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/accept` - Accept answer (question author only)

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Block/unblock user
- `DELETE /api/admin/questions/:id` - Delete question
- `DELETE /api/admin/answers/:id` - Delete answer
- `GET /api/admin/stats` - Get platform statistics

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Ask a Question**: Click "Ask Question" and provide title, description, and tags
3. **Browse Questions**: Use search, filters, and pagination to find interesting questions
4. **Answer Questions**: Provide helpful answers to community questions
5. **Vote**: Upvote good content and downvote poor content
6. **Accept Answers**: Mark the best answer if you're the question author
7. **Profile Management**: View your activity and update profile information

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies for optimal performance
- Inspired by popular Q&A platforms like Stack Overflow
- Designed with user experience and community building in mind

