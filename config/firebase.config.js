// Firebase Configuration
// Replace these values with your actual Firebase project configuration

export const firebaseConfig = {
  apiKey: "AIzaSyBNoGp43VglLTLaQjWoKWec1Wb1I9uokA0",
  authDomain: "healthai-cf468.firebaseapp.com",
  projectId: "healthai-cf468",
  storageBucket: "healthai-cf468.firebasestorage.app",
  messagingSenderId: "209710417191",
  appId: "1:209710417191:web:2c67a1e0382f81e8d15502",
  measurementId: "G-JERW0ZPDL6"
};

// Firebase Security Rules (for Firestore)
export const firestoreRules = `
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
`;

// Environment Configuration
export const environment = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true,
    logLevel: 'debug'
  },
  production: {
    apiUrl: 'https://api.healthai.com',
    debug: false,
    logLevel: 'error'
  }
};

// Application Configuration
export const appConfig = {
  name: 'HealthAI',
  version: '1.0.0',
  description: 'Chronic Disease Management Platform',
  features: {
    digitalTwin: true,
    aiCoach: true,
    blockchain: true,
    gamification: true,
    community: true,
    doctorPortal: true
  },
  limits: {
    maxFileSize: '10MB',
    maxUsersPerCommunity: 1000,
    maxHealthRecords: 10000
  }
};

