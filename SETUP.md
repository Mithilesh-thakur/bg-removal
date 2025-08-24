# Google Login + MongoDB Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=5000
```

### 2. Clerk Dashboard Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select existing one
3. Go to **Authentication** → **Social Connections**
4. Enable **Google** provider
5. Go to **Webhooks**
6. Add endpoint: `http://localhost:5000/api/user/webhooks`
7. Copy the webhook secret to your `.env` file

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Add it to your `.env` file

### 4. Start the Application

```bash
# Terminal 1 - Start Server
cd server
npm start

# Terminal 2 - Start Client
cd client
npm run dev
```

## 🔧 How It Works

### Authentication Flow:
1. User clicks "Get Started" → Clerk handles Google OAuth
2. After successful login → Clerk sends webhook to your server
3. Server creates/updates user in MongoDB
4. User data is stored with profile info + 10 credits

### Database Schema:
```javascript
{
  clerkId: "user_123...",
  email: "user@gmail.com",
  firstname: "John",
  lastname: "Doe",
  photo: "https://...",
  creditBalance: 10,
  createdAt: "2024-01-01T..."
}
```

## 🧪 Testing

### Test Endpoints:
- `GET /api/user/all` - View all users in database
- `GET /api/user/:clerkId` - View specific user
- `POST /api/user/webhooks` - Clerk webhook endpoint

### Test the Flow:
1. Start both server and client
2. Click "Get Started" and login with Google
3. Check server console for webhook logs
4. View user dashboard on the page
5. Check MongoDB Atlas for stored data

## 🐛 Troubleshooting

### Common Issues:

1. **Webhook not working:**
   - Check `CLERK_WEBHOOK_SECRET` in `.env`
   - Verify webhook URL in Clerk dashboard
   - Check server console for errors

2. **MongoDB connection failed:**
   - Verify `MONGODB_URI` in `.env`
   - Check network access in MongoDB Atlas
   - Ensure database user has correct permissions

3. **User not appearing in database:**
   - Check server console for webhook logs
   - Verify webhook endpoint is accessible
   - Check if user was created in Clerk

### Debug Commands:
```bash
# Check server logs
cd server && npm start

# Check MongoDB connection
# Look for "✅ MongoDB Connected" message

# Test webhook manually
curl -X POST http://localhost:5000/api/user/webhooks
```

## 📱 Features

- ✅ Google OAuth authentication
- ✅ Automatic user data syncing
- ✅ MongoDB Atlas integration
- ✅ User dashboard with profile info
- ✅ Credit system (10 credits per user)
- ✅ Real-time webhook processing
- ✅ Error handling and logging

## 🔒 Security

- Webhook signature verification
- Environment variable protection
- CORS enabled for development
- Input validation and sanitization
