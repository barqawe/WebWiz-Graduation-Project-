# WebWiz - Interactive Frontend Development Learning Platform

## 🎯 Project Overview

**WebWiz** is a comprehensive graduation project designed to revolutionize how students learn frontend web development. This interactive platform combines theoretical knowledge with hands-on practice, offering a structured learning path for mastering HTML, CSS, JavaScript, and React through real-time coding challenges and personalized feedback.

## ✨ Key Features

### 🎓 Learning Platform
- **Interactive Coding Environment**: Monaco Editor-powered IDE with real-time code execution
- **Progressive Learning Paths**: Structured roadmaps for Frontend Fundamentals and React Development
- **Live Preview**: Instant rendering of HTML/CSS/JavaScript and React components
- **Task-Based Learning**: Hands-on coding challenges with immediate feedback
- **Progress Tracking**: Comprehensive progress monitoring and achievement system

### 🛠️ Development Tools
- **Multi-Language Support**: HTML, CSS, JavaScript, and React (JSX)
- **Code Validation**: Real-time syntax checking and error detection
- **Task Creation System**: Comprehensive tool for educators to create custom coding challenges
- **Design-to-Code Challenges**: Upload design mockups and code them to life

### 🔐 User Management
- **Authentication System**: Secure user registration and login
- **Social Login**: Google and GitHub OAuth integration
- **Profile Management**: Personal dashboards with learning statistics
- **Password Recovery**: Email-based password reset functionality

### 📊 Analytics & Progress
- **Learning Analytics**: Detailed progress tracking across different technologies
- **Achievement System**: Gamified learning with points and milestones
- **Leaderboard**: Community-driven competitive learning environment
- **Task Completion Statistics**: Visual progress indicators and completion rates

## 🏗️ Architecture

### Frontend (Next.js)
```
FrontEnd/
├── app/                    # Next.js App Router pages
│   ├── (Auth)/            # Authentication routes
│   ├── about/             # About page
│   ├── auth/              # Auth pages
│   ├── create/            # Task creation interface
│   ├── leaderboard/       # Community leaderboard
│   ├── learning-paths/    # Learning path selection
│   ├── playground/        # Free coding environment
│   ├── profile/           # User profile management
│   ├── roadmap/           # Learning roadmaps
│   └── tasks/             # Task interface
├── components/            # Reusable React components
│   ├── Header/            # Navigation header
│   ├── Footer/            # Site footer
│   ├── Ide/               # Code editor component
│   ├── UI/                # UI components
│   └── ValidationH*/      # Code validation components
├── store/                 # Zustand state management
├── utils/                 # Utility functions
└── guard/                 # Route protection
```

### Backend (ASP.NET Core)
```
BackEnd/
├── WhateverEnd/           # Main API project
│   ├── Controllers/       # API endpoints
│   ├── Middlewares/       # Custom middleware
│   └── Program.cs         # Application entry point
├── App/                   # Application layer
│   ├── Service/           # Business logic services
│   ├── Repository/        # Data access layer
│   ├── Dto's/             # Data transfer objects
│   └── Mapper/            # AutoMapper profiles
├── Domain/                # Domain entities
│   ├── Entities/          # Database models
│   └── Exceptions/        # Custom exceptions
└── Infrastructure/        # Infrastructure layer
    ├── DataHandler/       # Database context
    ├── Repository/        # Repository implementations
    └── ExternalServices/  # Third-party integrations
```

## 💻 Technology Stack

### Frontend Technologies
- **Framework**: Next.js 15.2.3 (React 19)
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS 4.0
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Code Transformation**: Babel (for JSX compilation)
- **Icons**: React Icons, Lucide React
- **Authentication**: Custom JWT + OAuth (Google, GitHub)

### Backend Technologies
- **Framework**: ASP.NET Core 9.0
- **Language**: C#
- **Database**: Entity Framework Core with SQL Server
- **Authentication**: JWT Bearer + Google OAuth
- **Email Service**: MailKit + MimeKit
- **API Documentation**: Scalar (OpenAPI)
- **Architecture**: Clean Architecture with DDD patterns

### Development Tools
- **Version Control**: Git
- **Package Managers**: npm (Frontend), NuGet (Backend)
- **Code Quality**: ESLint, TypeScript ESLint
- **Testing**: Built-in validation systems

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- .NET 9.0 SDK
- SQL Server or SQL Server Express
- Git

### Frontend Setup
```bash
# Navigate to frontend directory
cd FrontEnd

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd BackEnd/WhateverEnd

# Restore NuGet packages
dotnet restore

# Update database (if needed)
dotnet ef database update

# Run the application
dotnet run
```

### Environment Configuration

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

#### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your_connection_string"
  },
  "Authentication": {
    "Google": {
      "ClientId": "your_google_client_id",
      "ClientSecret": "your_google_client_secret"
    }
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "your_email",
    "SmtpPassword": "your_app_password"
  }
}
```

## 📚 Learning Paths

### 1. Frontend Fundamentals
**Duration**: ~20 hours | **Tasks**: 10
- HTML structure and semantics
- CSS styling and layouts
- JavaScript fundamentals
- DOM manipulation
- Responsive design principles

### 2. React Development
**Duration**: ~25 hours | **Tasks**: 10
- React components and JSX
- Props and state management
- React Hooks (useState, useEffect)
- Event handling and forms
- Component composition
- React Router for navigation
- Context API for state management

## 🎮 Key Features Explained

### Interactive Code Editor
- **Monaco Editor Integration**: Professional VS Code-like editing experience
- **Multi-tab Support**: Switch between HTML, CSS, JavaScript, and React files
- **Syntax Highlighting**: Language-specific code highlighting
- **Error Detection**: Real-time syntax error highlighting
- **Auto-completion**: Intelligent code suggestions

### Live Preview System
- **Instant Rendering**: See changes immediately as you type
- **Iframe Isolation**: Safe code execution in isolated environments
- **React Support**: Full JSX compilation and React component rendering
- **Error Handling**: Graceful error display for debugging

### Task Management
- **Progressive Unlocking**: Complete tasks to unlock the next challenges
- **Difficulty Levels**: Easy, Medium, and Hard task classifications
- **Visual Design Matching**: Upload designs and code them pixel-perfect
- **Automated Validation**: Code validation against expected outputs

### Progress Tracking
- **Local Storage**: Client-side progress persistence
- **Visual Indicators**: Progress bars and completion percentages
- **Achievement System**: Points and milestone celebrations
- **Learning Analytics**: Track time spent and completion rates

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Password update
- `POST /api/auth/send-reset-code` - Password reset

### Tasks & Progress
- `GET /api/roadmaps` - Get learning roadmaps
- `POST /api/progress` - Submit task progress
- `GET /api/progress/{userId}` - Get user progress

### Task Management
- `POST /api/designtask` - Create new coding task
- `GET /api/designtask/{id}` - Get task details

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper cross-origin request handling
- **Rate Limiting**: API endpoint protection
- **Secure Headers**: Security headers implementation

## 🎨 UI/UX Features

- **Dark/Light Mode**: Theme switching capability
- **Responsive Design**: Mobile-first responsive layout
- **Smooth Animations**: Framer Motion animations
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern Design**: Clean, professional interface
- **Interactive Elements**: Hover effects and transitions

## 📱 Mobile Compatibility

- **Touch Navigation**: Swipe gestures for mobile devices
- **Responsive Editor**: Mobile-optimized code editor
- **Adaptive Layout**: Flexible grid system
- **Touch-Friendly**: Large tap targets and spacing

## 🧪 Code Validation System

### HTML Validation
- Syntax checking
- Semantic HTML validation
- Accessibility compliance

### CSS Validation
- Property validation
- Responsive design checking
- Cross-browser compatibility

### JavaScript Validation
- Syntax error detection
- Runtime error handling
- Best practices enforcement

### React Validation
- JSX syntax validation
- Component structure checking
- Hook usage validation

## 📈 Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component-level lazy loading
- **Caching Strategy**: Efficient caching mechanisms
- **Bundle Optimization**: Minimized bundle sizes

## 🔄 State Management

### Zustand Stores
- **authStore**: User authentication state
- **emailStore**: Email verification state
- **Task Progress**: Local storage integration

### Local Storage Integration
- Progress persistence
- User preferences
- Session management

## 📧 Email Integration

- **Password Reset**: Secure email-based password reset
- **Account Verification**: Email verification system
- **Notifications**: Progress milestone notifications

## 🎯 Target Audience

- **Students**: Learning web development fundamentals
- **Educators**: Teaching frontend development concepts
- **Self-learners**: Individuals pursuing web development skills
- **Bootcamp Students**: Structured learning path followers

## 🏆 Achievements & Gamification

- **Point System**: Earn points for completed tasks
- **Progress Badges**: Visual achievement indicators
- **Leaderboard**: Community ranking system
- **Streak Tracking**: Consecutive learning day tracking
- **Milestone Celebrations**: Progress celebration animations

## 🔮 Future Enhancements

- **Advanced React Topics**: Redux, Next.js, TypeScript
- **Backend Development**: Node.js, Python, API development
- **Database Integration**: SQL and NoSQL databases
- **DevOps Fundamentals**: Git, deployment, CI/CD
- **Mobile Development**: React Native integration
- **AI-Powered Hints**: Intelligent code suggestions
- **Peer Code Review**: Community code review system
- **Live Collaboration**: Real-time pair programming

## 👥 Contributors

This project is a graduation project developed by passionate students committed to improving web development education through interactive learning experiences.

## 📄 License

This project is developed as an educational graduation project. Please contact the development team for usage rights and licensing information.

## 🆘 Support

For technical support, feature requests, or educational partnerships, please reach out through our project repository or contact the development team directly.

---

**WebWiz** - Transforming the way frontend development is learned, one interactive challenge at a time. 🚀
