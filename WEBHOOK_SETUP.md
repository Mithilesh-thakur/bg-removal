# Clerk Webhook Setup Guide

This guide explains how to set up automatic user creation in MongoDB when users sign up through Clerk.

## How It Works

1. **User signs up through Clerk** (on your frontend)
2. **Clerk sends webhook** to your server at `/api/user/webhooks`
3. **Server automatically creates user** in MongoDB with initial credits
4. **User data is immediately available** in your database

## Setup Steps

### 1. Server Environment Variables

Create a `.env` file in your `server` directory:

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Clerk Webhook Secret (get this from Clerk Dashboard)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Server Port
PORT=5000
```

### 2. Clerk Dashboard Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Set the endpoint URL: `http://your-domain.com/api/user/webhooks`
6. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `email_address.created`
   - `email_address.updated`
   - `email_address.deleted`
7. Copy the **Signing Secret** (starts with `whsec_`)
8. Paste it into your `.env` file as `CLERK_WEBHOOK_SECRET`

### 3. Test Your Webhook

1. Start your server: `npm run dev` (in server directory)
2. Test the webhook endpoint: `GET http://localhost:5000/api/user/webhooks/verify`
3. You should see: `{"message":"Webhook endpoint is working","status":"active"}`

### 4. Test User Creation

1. Go to your frontend and sign up a new user through Clerk
2. Check your server console for webhook logs
3. Check MongoDB to see if the user was created
4. The user should have 10 initial credits

## Webhook Events Handled

- **`user.created`**: Creates new user in MongoDB with 10 credits
- **`user.updated`**: Updates existing user or creates if not found
- **`user.deleted`**: Removes user from MongoDB
- **`email_address.*`**: Updates user's email address

## Troubleshooting

### Webhook Not Receiving Events

1. Check if your server is accessible from the internet
2. Verify the webhook URL in Clerk Dashboard
3. Check server logs for webhook errors
4. Ensure `CLERK_WEBHOOK_SECRET` is set correctly

### User Not Created in Database

1. Check server console for webhook logs
2. Verify MongoDB connection
3. Check if webhook signature verification is passing
4. Ensure the webhook endpoint is receiving raw JSON body

### Database Connection Issues

1. Verify `MONGODB_URI` in `.env`
2. Check if MongoDB is running
3. Ensure network access to MongoDB cluster

## Production Deployment

1. **Use HTTPS**: Clerk requires HTTPS for production webhooks
2. **Environment Variables**: Set proper environment variables on your hosting platform
3. **MongoDB**: Use a production MongoDB instance (Atlas, etc.)
4. **Monitoring**: Monitor webhook delivery and database operations

## Security Features

- **Signature Verification**: All webhooks are verified using Clerk's signing secret
- **Input Validation**: User data is validated before database operations
- **Error Handling**: Comprehensive error handling and logging
- **Rate Limiting**: Consider adding rate limiting for production

## API Endpoints

- `POST /api/user/webhooks` - Clerk webhook endpoint
- `GET /api/user/webhooks/verify` - Test webhook endpoint
- `GET /api/user/:clerkId` - Get user by Clerk ID
- `GET /api/user/credits` - Get user credits (authenticated)
- `GET /api/user/all` - Get all users (for testing)

## Example Webhook Payload

```json
{
  "data": {
    "id": "user_2abc123def456",
    "email_addresses": [
      {
        "email_address": "user@example.com"
      }
    ],
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://example.com/avatar.jpg"
  },
  "type": "user.created"
}
```

## Database Schema

```javascript
{
  clerkId: String,        // Clerk user ID (unique)
  email: String,          // User's email address
  firstname: String,      // User's first name
  lastname: String,       // User's last name
  photo: String,          // User's profile photo URL
  creditBalance: Number,  // Available credits (default: 10)
  createdAt: Date         // Account creation timestamp
}
```

## Support

If you encounter issues:

1. Check server console logs
2. Verify Clerk webhook configuration
3. Test database connectivity
4. Check environment variables
5. Ensure proper webhook endpoint URL

