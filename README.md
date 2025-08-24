# Background Removal App

A web application that removes backgrounds from images using AI, with user authentication and credit system.

## Features

- **Background Removal**: Remove backgrounds from images using AI
- **User Authentication**: Sign up, sign in, and Google OAuth integration
- **Credit System**: Users get credits for processing images
- **Modern UI**: Built with React and Tailwind CSS
- **Secure Backend**: Node.js/Express with JWT authentication

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js/Express
- MongoDB with Mongoose
- JWT authentication
- Google OAuth 2.0
- Multer for file uploads
- Bcrypt for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Google Cloud Console account (for OAuth)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd bg-removal
```

### 2. Install server dependencies
```bash
cd server
npm install
```

### 3. Install client dependencies
```bash
cd ../client
npm install
```

### 4. Environment Setup

#### Server (.env)
```bash
cd ../server
cp env.example .env
```

Edit `.env` file:
```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# JWT Secret for authentication tokens
JWT_SECRET=your_jwt_secret_here_make_it_long_and_random

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Server Port
PORT=5000

# Clipdrop API Key (for background removal)
CLIPDROP_API=your_clipdrop_api_key_here
```

#### Client (.env)
```bash
cd ../client
cp env.example .env
```

Edit `.env` file:
```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5000

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set Application Type to "Web application"
6. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
7. Copy the Client ID and Client Secret

### 6. Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Running the Application

### 1. Start the server
```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Start the client
```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/user/signup` - User registration
- `POST /api/user/signin` - User login
- `POST /api/user/google-signin` - Google OAuth login
- `GET /api/user/profile` - Get user profile (protected)
- `GET /api/user/credits` - Get user credits (protected)

### Images
- `POST /api/image/remove-bg` - Remove background from image (protected)

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (optional for Google users),
  firstname: String,
  lastname: String,
  photo: String,
  googleId: String (unique, sparse),
  creditBalance: Number (default: 10),
  createdAt: Date
}
```

## Features

### User Authentication
- **Local Authentication**: Email/password registration and login
- **Google OAuth**: Sign in with Google account
- **JWT Tokens**: Secure authentication with 7-day expiration
- **Password Hashing**: Bcrypt with 12 salt rounds

### Background Removal
- **AI-Powered**: Uses Clipdrop API for background removal
- **Credit System**: Each image processing costs 1 credit
- **File Upload**: Supports various image formats
- **Base64 Response**: Returns processed image as base64 string

### User Management
- **Profile Management**: View and update user information
- **Credit Tracking**: Monitor remaining credits
- **Session Management**: Persistent login with JWT

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication middleware for sensitive endpoints
- **CORS Configuration**: Proper cross-origin resource sharing

## Development

### Project Structure
```
bg-removal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middlewares
│   └── configs/           # Configuration files
└── README.md              # This file
```

### Available Scripts

#### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

#### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB connection string
   - Ensure MongoDB is running
   - Verify network access

2. **Google OAuth Not Working**
   - Verify Google Client ID is correct
   - Check authorized origins in Google Console
   - Ensure Google+ API is enabled

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format in headers

4. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend URL is allowed
   - Check browser console for specific errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.
