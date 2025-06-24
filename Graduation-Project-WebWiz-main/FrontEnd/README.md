# WebWiz – Frontend

WebWiz is an interactive front-end development learning platform designed to help users practice HTML, CSS, JavaScript, and React through real-time coding challenges. This repository contains the frontend part of the project, built with **Next.js**, **React**, and **Monaco Editor**.

## ✨ Features

- 🧠 Coding tasks with live feedback
- 🖊️ Monaco-based code editor
- ⚛️ JSX & React code support using Babel
- 🧪 Real-time rendering in an isolated iframe
- 🔐 Authentication with Zustand state management
- 📊 Progress tracking (via backend API)
- 📁 Task dashboard with categories and filters

## 🛠️ Tech Stack

- **Framework**: Next.js (React)
- **Editor**: Monaco Editor
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Code Transformation**: Babel
- **Authentication**: Custom auth flow with Zustand + Google OAuth
- **Bundler/Runtime**: Webpack (Next.js default)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Google Cloud Console account (for Google authentication)

### Installation

1. Clone the repo:

```bash
git clone https://github.com/Mohammad-Hanoun/web-wiz-front.git
cd webwiz-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Google Client ID
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Google Authentication Setup

To enable Google authentication, you need to:

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Identity Services**:
   - In the Google Cloud Console, navigate to "APIs & Services" > "Library"
   - Search for "Google Identity Services API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add your domains to "Authorized JavaScript origins":
     - `http://localhost:3000` (for development)
     - Your production domain (when deployed)
   - Add your domains to "Authorized redirect URIs":
     - `http://localhost:3000/login` (for development)
     - Your production login URL (when deployed)

4. **Copy the Client ID**:
   - Copy the generated Client ID
   - Add it to your `.env.local` file as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

5. **Backend Configuration**:
   - Ensure your backend is configured with the same Google Client ID
   - Your backend should handle the `/api/auth/google` endpoint that accepts:
     ```json
     {
       "provider": "google",
       "idToken": "google_id_token_here"
     }
     ```

### GitHub Authentication Setup

To enable GitHub authentication, you need to:

1. **Create a GitHub OAuth App**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the application details:
     - **Application name**: Your application name
     - **Homepage URL**: `http://localhost:3000` (for development)
     - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`

2. **Configure Environment Variables**:
   - Copy the Client ID from your GitHub OAuth App
   - Add it to your `.env.local` file:
     ```bash
     NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
     NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback
     ```

3. **Backend Configuration**:
   - Ensure your backend is configured with the GitHub Client ID and Client Secret
   - Your backend should handle the `/api/auth/github` endpoint that accepts:
     ```json
     {
       "provider": "github",
       "idToken": "github_authorization_code_here"
     }
     ```

### Verification Scripts

Run these commands to verify your OAuth setup:

```bash
# Check Google OAuth configuration
npm run check-google-auth

# Check GitHub OAuth configuration
npm run check-github-auth
```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
