# Firebase Setup Guide for HealthAI

This guide will help you set up Firebase Authentication and Firestore Database for the HealthAI application.

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `healthai-project` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🔐 Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Enable **Email/Password** authentication
6. Click **Save**

## 🗄️ Step 3: Set up Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (we'll set up security rules)
4. Select a location for your database (choose closest to your users)
5. Click **Done**

## 🔒 Step 4: Configure Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Health data is private to the user
    match /healthData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Blockchain logs are readable by authenticated users
    match /blockchainLogs/{logId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Community posts are readable by all authenticated users
    match /communityPosts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## ⚙️ Step 5: Get Firebase Configuration

1. In your Firebase project, click the **Settings** gear icon
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click **Add app** and select **Web** (</> icon)
5. Register your app with a nickname (e.g., "HealthAI Web App")
6. Copy the **Firebase configuration object**

## 🔧 Step 6: Update Your Code

1. Open `index.html`
2. Find the `firebaseConfig` object (around line 19)
3. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 🧪 Step 7: Test Your Setup

1. Open `index.html` in your browser
2. Open browser developer tools (F12)
3. Check the console for "Firebase initialized successfully"
4. Try creating a new account
5. Check Firebase Console > Authentication > Users to see the new user
6. Check Firebase Console > Firestore Database to see the user data

## 📊 Step 8: Monitor Your Data

### Authentication Users
- Go to **Authentication** > **Users** to see registered users
- You can manage users, reset passwords, etc.

### Firestore Data
- Go to **Firestore Database** > **Data** to see stored documents
- You'll see collections: `users`, `healthData`, `blockchainLogs`

## 🚨 Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**
   - Check that your Firebase config is correct
   - Ensure you've enabled Email/Password authentication
   - Check browser console for errors

2. **Permission denied errors**
   - Verify your Firestore security rules are published
   - Check that the user is authenticated

3. **CORS errors**
   - Make sure you're running from a web server (not file://)
   - Use a local server like Live Server in VS Code

### Testing Commands:

```javascript
// Test Firebase connection in browser console
console.log(window.firebaseService.isReady());

// Test user creation
window.firebaseService.createUser('test@example.com', 'password123', {
  role: 'patient',
  name: 'Test User',
  avatar: 'TU',
  preferences: { theme: 'light', notifications: true },
  healthData: { conditions: [], medications: [] }
});
```

## 🔐 Security Best Practices

1. **Never commit Firebase config with real API keys to public repositories**
2. **Use environment variables for production**
3. **Regularly review and update security rules**
4. **Monitor authentication logs for suspicious activity**
5. **Use Firebase App Check for additional security**

## 📱 Production Deployment

For production deployment:

1. **Set up custom domain** in Firebase Hosting
2. **Configure Firebase App Check** for additional security
3. **Set up monitoring** with Firebase Performance Monitoring
4. **Configure backup** for Firestore data
5. **Set up alerts** for authentication failures

## 🆘 Support

If you encounter issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the browser console for error messages
3. Check Firebase Console for authentication and database errors
4. Ensure your Firebase project is properly configured

---

**Note**: This setup provides a secure, scalable foundation for your HealthAI application with Firebase Authentication and Firestore Database integration.
