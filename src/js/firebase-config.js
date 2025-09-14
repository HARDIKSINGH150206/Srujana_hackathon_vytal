// Firebase Configuration and Setup Instructions
// This file contains the Firebase configuration and setup instructions

/*
SETUP INSTRUCTIONS:

1. Go to https://console.firebase.google.com/
2. Create a new project or select existing project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Get your configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Add app" > Web app
   - Copy the config object
6. Replace the firebaseConfig object in index.html with your actual config

SECURITY RULES FOR FIRESTORE:

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

EXAMPLE FIREBASE CONFIG:
Replace the placeholder config in index.html with your actual config:

const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
*/

// Firebase utility functions
class FirebaseService {
    constructor() {
        this.auth = null;
        this.db = null;
        this.isInitialized = false;
    }

    // Initialize Firebase (called from index.html)
    initialize(firebaseInstance) {
        this.auth = firebaseInstance.auth;
        this.db = firebaseInstance.db;
        this.createUserWithEmailAndPassword = firebaseInstance.createUserWithEmailAndPassword;
        this.signInWithEmailAndPassword = firebaseInstance.signInWithEmailAndPassword;
        this.signOut = firebaseInstance.signOut;
        this.onAuthStateChanged = firebaseInstance.onAuthStateChanged;
        this.doc = firebaseInstance.doc;
        this.setDoc = firebaseInstance.setDoc;
        this.getDoc = firebaseInstance.getDoc;
        this.collection = firebaseInstance.collection;
        this.addDoc = firebaseInstance.addDoc;
        this.updateDoc = firebaseInstance.updateDoc;
        this.isInitialized = true;
        console.log('FirebaseService initialized');
    }

    // Check if Firebase is ready
    isReady() {
        return this.isInitialized && this.auth && this.db;
    }

    // Create user account with Firebase Auth
    async createUser(email, password, userData) {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        try {
            // Create user with Firebase Auth
            const userCredential = await this.createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Store additional user data in Firestore
            await this.setDoc(this.doc(this.db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                role: userData.role,
                name: userData.name,
                avatar: userData.avatar,
                preferences: userData.preferences,
                createdAt: new Date(),
                lastLogin: new Date()
            });

            // Store health data
            await this.setDoc(this.doc(this.db, 'healthData', user.uid), {
                userId: user.uid,
                ...userData.healthData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Log blockchain transaction
            await this.logBlockchainTransaction('SIGNUP', user.uid);

            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Sign in user with Firebase Auth
    async signInUser(email, password) {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        try {
            const userCredential = await this.signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Update last login time
            await this.updateDoc(this.doc(this.db, 'users', user.uid), {
                lastLogin: new Date()
            });

            // Log blockchain transaction
            await this.logBlockchainTransaction('LOGIN', user.uid);

            return user;
        } catch (error) {
            console.error('Error signing in user:', error);
            throw error;
        }
    }

    // Get user data from Firestore
    async getUserData(userId) {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        try {
            const userDoc = await this.getDoc(this.doc(this.db, 'users', userId));
            const healthDoc = await this.getDoc(this.doc(this.db, 'healthData', userId));

            if (userDoc.exists() && healthDoc.exists()) {
                return {
                    ...userDoc.data(),
                    healthData: healthDoc.data()
                };
            } else {
                throw new Error('User data not found');
            }
        } catch (error) {
            console.error('Error getting user data:', error);
            throw error;
        }
    }

    // Update user data in Firestore
    async updateUserData(userId, userData) {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        try {
            await this.updateDoc(this.doc(this.db, 'users', userId), {
                ...userData,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating user data:', error);
            throw error;
        }
    }

    // Update health data in Firestore
    async updateHealthData(userId, healthData) {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        try {
            await this.updateDoc(this.doc(this.db, 'healthData', userId), {
                ...healthData,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating health data:', error);
            throw error;
        }
    }

    // Log blockchain transaction
    async logBlockchainTransaction(action, userId, data = {}) {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        try {
            await this.addDoc(this.collection(this.db, 'blockchainLogs'), {
                action: action,
                userId: userId,
                data: data,
                timestamp: new Date(),
                hash: '0x' + Math.random().toString(16).substr(2, 64)
            });
        } catch (error) {
            console.error('Error logging blockchain transaction:', error);
            throw error;
        }
    }

    // Sign out user
    async signOutUser() {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        try {
            await this.signOut(this.auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    // Listen to auth state changes
    onAuthStateChange(callback) {
        if (!this.isReady()) {
            throw new Error('Firebase not initialized');
        }

        return this.onAuthStateChanged(this.auth, callback);
    }
}

// Create global Firebase service instance
window.firebaseService = new FirebaseService();

// Initialize Firebase service when Firebase is ready
window.addEventListener('firebase-ready', () => {
    if (window.firebase) {
        window.firebaseService.initialize(window.firebase);
    }
});
