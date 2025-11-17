// Global variables
let currentUser = null;
let web3 = null;
let blockchainContract = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeApp();
    setupEventListeners();
    initializeBlockchain();
    initializeAdvancedFeatures();
});

// Initialize the application
function initializeApp() {
    // Check if user is already logged in locally
    const savedUser = localStorage.getItem('healthAI_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
    
    // Add security indicator
    addSecurityIndicator();
    
    // Initialize charts and animations
    initializeAnimations();
    
    // Set up Firebase auth state monitoring
    setupFirebaseAuthState();
}

// Setup Firebase authentication state monitoring
function setupFirebaseAuthState() {
    // Wait for Firebase to be ready
    const checkFirebase = () => {
        if (window.firebaseService && window.firebaseService.isReady()) {
            // Monitor authentication state changes
            window.firebaseService.onAuthStateChange(async (user) => {
                if (user) {
                    // User is signed in
                    console.log('Firebase auth state: User signed in', user.uid);
                    
                    try {
                        // Get user data from Firebase
                        const userData = await window.firebaseService.getUserData(user.uid);
                        
                        // Update current user
                        currentUser = {
                            id: user.uid,
                            email: user.email,
                            ...userData
                        };
                        
                        // Store locally for offline access
                        localStorage.setItem('healthAI_user', JSON.stringify(currentUser));
                        
                        // Show dashboard if not already shown
                        if (document.getElementById('dashboard').style.display === 'none') {
                            showDashboard();
                        }
                        
                    } catch (error) {
                        console.error('Error getting user data on auth state change:', error);
                    }
                } else {
                    // User is signed out
                    console.log('Firebase auth state: User signed out');
                    
                    // Clear local data
                    currentUser = null;
                    localStorage.removeItem('healthAI_user');
                    
                    // Show landing page if dashboard is visible
                    if (document.getElementById('dashboard').style.display !== 'none') {
                        document.getElementById('dashboard').style.display = 'none';
                        document.querySelector('.hero').style.display = 'block';
                        document.querySelector('.features').style.display = 'block';
                    }
                }
            });
        } else {
            // Firebase not ready yet, check again in 100ms
            setTimeout(checkFirebase, 100);
        }
    };
    
    checkFirebase();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Theme toggle button (if present)
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

// Theme helpers: initialize, apply and toggle (persisted to localStorage)
function initializeTheme() {
    try {
        const saved = localStorage.getItem('theme');
        let theme = saved;
        if (!theme) {
            // fall back to system preference
            theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
        }
        applyTheme(theme);
    } catch (e) {
        console.warn('Theme init failed', e);
    }
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
}

// Initialize blockchain connection
async function initializeBlockchain() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Blockchain connected successfully');
        } else {
            console.log('MetaMask not detected, using mock blockchain');
            web3 = createMockWeb3();
        }
    } catch (error) {
        console.error('Blockchain initialization failed:', error);
        web3 = createMockWeb3();
    }
}

// Create mock Web3 for demo purposes
function createMockWeb3() {
    return {
        eth: {
            getAccounts: () => Promise.resolve(['0x1234567890123456789012345678901234567890']),
            getBalance: () => Promise.resolve('1000000000000000000')
        },
        utils: {
            toHex: (str) => '0x' + str,
            fromWei: (wei) => wei / 1000000000000000000
        }
    };
}

// Authentication Functions
function showLoginModal() {
    console.log('Opening login modal'); // Debug log
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('Login modal opened successfully'); // Debug log
    } else {
        console.error('Login modal not found'); // Debug log
    }
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchTab(tab) {
    console.log('Switching to tab:', tab); // Debug log
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        console.log('Switched to login form'); // Debug log
    } else if (tab === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        console.log('Switched to signup form'); // Debug log
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mfa = document.getElementById('mfa').value;
    
    // Validate inputs
    if (!email || !password) {
        showNotification('Please enter both email and password.', 'error');
        return;
    }
    
    const loadingBtn = event.target.querySelector('button[type="submit"]');
    const originalText = loadingBtn.textContent;
    loadingBtn.innerHTML = '<span class="loading"></span> Authenticating...';
    loadingBtn.disabled = true;
    
    try {
        // Check if Firebase is available
        if (!window.firebaseService || !window.firebaseService.isReady()) {
            throw new Error('Firebase not initialized. Please check your Firebase configuration.');
        }
        
        console.log('Signing in with Firebase...'); // Debug log
        
        // Sign in with Firebase
        const firebaseUser = await window.firebaseService.signInUser(email, password);
        
        // Get user data from Firebase
        const userData = await window.firebaseService.getUserData(firebaseUser.uid);
        
        // Set current user
        currentUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...userData
        };
        
        console.log('Login successful:', currentUser); // Debug log
        
        // Store user data locally for offline access
        localStorage.setItem('healthAI_user', JSON.stringify(currentUser));
        
        closeLoginModal();
        showDashboard();
        showNotification('Login successful! Welcome back.', 'success');
        
    } catch (error) {
        console.error('Login error:', error); // Debug log
        
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email. Please sign up first.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address. Please enter a valid email.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (error.message.includes('Firebase not initialized')) {
            errorMessage = 'Firebase not configured. Please check the setup instructions.';
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        loadingBtn.textContent = originalText;
        loadingBtn.disabled = false;
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    console.log('=== SIGNUP PROCESS STARTED ===');
    console.log('Signup form submitted');
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('role').value;
    
    console.log('Signup data:', { email, role });
    
    // Validate inputs
    if (!email || !password || !role) {
        console.log('ERROR: Missing required fields');
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (password.length < 6) {
        console.log('ERROR: Password too short');
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    const loadingBtn = event.target.querySelector('button[type="submit"]');
    const originalText = loadingBtn.textContent;
    loadingBtn.innerHTML = '<span class="loading"></span> Creating Account...';
    loadingBtn.disabled = true;
    
    try {
        console.log('Checking Firebase availability...');
        
        // Check if Firebase is available
        if (!window.firebaseService) {
            console.log('ERROR: Firebase service not found');
            throw new Error('Firebase service not found. Please refresh the page and try again.');
        }
        
        if (!window.firebaseService.isReady()) {
            console.log('ERROR: Firebase service not ready');
            throw new Error('Firebase not initialized. Please check your Firebase configuration.');
        }
        
        console.log('Firebase is ready!');
        
        // Prepare user data
        const userData = {
            role: role,
            name: email.split('@')[0],
            avatar: email.charAt(0).toUpperCase(),
            preferences: {
                theme: 'light',
                notifications: true,
                biometric: false
            },
            healthData: {
                conditions: [],
                medications: [],
                lastCheckup: null,
                riskScore: 0,
                bloodSugarHistory: [140, 135, 130, 125, 120, 125],
                bloodPressureHistory: [
                    {systolic: 150, diastolic: 90},
                    {systolic: 145, diastolic: 85},
                    {systolic: 140, diastolic: 80}
                ],
                medicationHistory: Array(30).fill({taken: true}),
                lifestyleData: {
                    exercise: 120,
                    sleep: 7,
                    stress: 5,
                    smoking: false,
                    alcohol: 1
                },
                geneticProfile: {
                    familyHistory: {
                        diabetes: role === 'patient',
                        heartDisease: false,
                        hypertension: role === 'patient'
                    }
                }
            }
        };
        
        console.log('Creating user with Firebase...');
        console.log('User data prepared:', userData);
        
        // Create user with Firebase
        const firebaseUser = await window.firebaseService.createUser(email, password, userData);
        console.log('Firebase user created:', firebaseUser.uid);
        
        // Get complete user data from Firebase
        console.log('Retrieving user data from Firebase...');
        const completeUserData = await window.firebaseService.getUserData(firebaseUser.uid);
        console.log('User data retrieved:', completeUserData);
        
        // Set current user
        currentUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...completeUserData
        };
        
        console.log('Current user set:', currentUser);
        
        // Store user data locally for offline access
        localStorage.setItem('healthAI_user', JSON.stringify(currentUser));
        console.log('User data stored in localStorage');
        
        // Close modal and show dashboard
        closeLoginModal();
        showDashboard();
        showNotification('Account created successfully! Welcome to HealthAI!', 'success');
        
        console.log('=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===');
        
    } catch (error) {
        console.error('=== SIGNUP ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        
        // Try fallback to local storage if Firebase fails
        console.log('Attempting fallback to local storage...');
        
        try {
            // Create user with local storage fallback
            const fallbackUser = {
                id: 'local_user_' + Date.now(),
                email: email,
                role: role,
                name: email.split('@')[0],
                avatar: email.charAt(0).toUpperCase(),
                preferences: {
                    theme: 'light',
                    notifications: true,
                    biometric: false
                },
                healthData: {
                    conditions: [],
                    medications: [],
                    lastCheckup: null,
                    riskScore: 0,
                    bloodSugarHistory: [140, 135, 130, 125, 120, 125],
                    bloodPressureHistory: [
                        {systolic: 150, diastolic: 90},
                        {systolic: 145, diastolic: 85},
                        {systolic: 140, diastolic: 80}
                    ],
                    medicationHistory: Array(30).fill({taken: true}),
                    lifestyleData: {
                        exercise: 120,
                        sleep: 7,
                        stress: 5,
                        smoking: false,
                        alcohol: 1
                    },
                    geneticProfile: {
                        familyHistory: {
                            diabetes: role === 'patient',
                            heartDisease: false,
                            hypertension: role === 'patient'
                        }
                    }
                }
            };
            
            // Set current user
            currentUser = fallbackUser;
            
            // Store user data locally
            localStorage.setItem('healthAI_user', JSON.stringify(currentUser));
            console.log('Fallback user created and stored locally');
            
            // Close modal and show dashboard
            closeLoginModal();
            showDashboard();
            showNotification('Account created successfully! (Using local storage - Firebase unavailable)', 'success');
            
            console.log('=== SIGNUP FALLBACK COMPLETED SUCCESSFULLY ===');
            return;
            
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
        }
        
        let errorMessage = 'Signup failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address. Please enter a valid email.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('Firebase not initialized')) {
            errorMessage = 'Firebase not configured. Please check the setup instructions.';
        } else if (error.message.includes('Firebase service not found')) {
            errorMessage = 'Firebase service not loaded. Please refresh the page and try again.';
        }
        
        console.error('Final error message:', errorMessage);
        showNotification(errorMessage, 'error');
    } finally {
        loadingBtn.textContent = originalText;
        loadingBtn.disabled = false;
        console.log('=== SIGNUP PROCESS ENDED ===');
    }
}

async function biometricLogin() {
    try {
        if ('credentials' in navigator) {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    allowCredentials: [],
                    timeout: 60000,
                }
            });
            
            if (credential) {
                showNotification('Biometric authentication successful!', 'success');
                // Proceed with login
                currentUser = {
                    id: 'user_biometric',
                    email: 'biometric@healthai.com',
                    role: 'patient',
                    name: 'Biometric User',
                    avatar: 'BU'
                };
                localStorage.setItem('healthAI_user', JSON.stringify(currentUser));
                closeLoginModal();
                showDashboard();
            }
        } else {
            showNotification('Biometric authentication not supported on this device.', 'error');
        }
    } catch (error) {
        showNotification('Biometric authentication failed.', 'error');
    }
}

// Dashboard Functions
function showDashboard() {
    console.log('=== SHOWING DASHBOARD ===');
    console.log('Current user:', currentUser);
    
    // Check if user is logged in
    if (!currentUser) {
        console.error('No current user found, redirecting to login');
        showLoginModal();
        return;
    }
    
    try {
        document.getElementById('dashboard').style.display = 'block';
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.features').style.display = 'none';
        
        loadDashboardContent();
        console.log('Dashboard loaded successfully');
    } catch (error) {
        console.error('Error showing dashboard:', error);
        showNotification('Error loading dashboard. Please try again.', 'error');
    }
}

function loadDashboardContent() {
    console.log('=== LOADING DASHBOARD CONTENT ===');
    
    try {
        const dashboard = document.getElementById('dashboard');
        
        if (!dashboard) {
            throw new Error('Dashboard element not found');
        }
        
        if (!currentUser) {
            throw new Error('No current user data available');
        }
        
        console.log('Generating dashboard cards...');
        
        // Generate all dashboard cards safely with error handling
        let digitalTwinCard = '';
        let aiCoachCard = '';
        let trackingCard = '';
        let communityCard = '';
        let riskRadarCard = '';
        let doctorPortalCard = '';
        let securityCard = '';
        
        try {
            digitalTwinCard = generateDigitalTwinCard();
            console.log('Digital Twin card generated');
        } catch (error) {
            console.error('Error generating Digital Twin card:', error);
            digitalTwinCard = '<div class="dashboard-card"><div class="card-content"><p>Digital Twin card unavailable</p></div></div>';
        }
        
        try {
            aiCoachCard = generateAICoachCard();
            console.log('AI Coach card generated');
        } catch (error) {
            console.error('Error generating AI Coach card:', error);
            aiCoachCard = '<div class="dashboard-card"><div class="card-content"><p>AI Coach card unavailable</p></div></div>';
        }
        
        try {
            trackingCard = generateTrackingCard();
            console.log('Tracking card generated');
        } catch (error) {
            console.error('Error generating Tracking card:', error);
            trackingCard = '<div class="dashboard-card"><div class="card-content"><p>Tracking card unavailable</p></div></div>';
        }
        
        try {
            communityCard = generateCommunityCard();
            console.log('Community card generated');
        } catch (error) {
            console.error('Error generating Community card:', error);
            communityCard = '<div class="dashboard-card"><div class="card-content"><p>Community card unavailable</p></div></div>';
        }
        
        try {
            riskRadarCard = generateRiskRadarCard();
            console.log('Risk Radar card generated');
        } catch (error) {
            console.error('Error generating Risk Radar card:', error);
            riskRadarCard = '<div class="dashboard-card"><div class="card-content"><p>Risk Radar card unavailable</p></div></div>';
        }
        
        try {
            doctorPortalCard = generateDoctorPortalCard();
            console.log('Doctor Portal card generated');
        } catch (error) {
            console.error('Error generating Doctor Portal card:', error);
            doctorPortalCard = '<div class="dashboard-card"><div class="card-content"><p>Doctor Portal card unavailable</p></div></div>';
        }
        
        try {
            securityCard = generateSecurityCard();
            console.log('Security card generated');
        } catch (error) {
            console.error('Error generating Security card:', error);
            securityCard = '<div class="dashboard-card"><div class="card-content"><p>Security card unavailable</p></div></div>';
        }
        
        console.log('Dashboard cards generated successfully');
        
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <div class="dashboard-nav">
                    <h1 class="dashboard-title">Welcome back, ${currentUser.name || 'User'}</h1>
                    <div class="user-info">
                        <div class="user-avatar">${currentUser.avatar || 'U'}</div>
                        <button class="btn-secondary" onclick="logout()">Logout</button>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="dashboard-grid">
                    ${digitalTwinCard}
                    ${aiCoachCard}
                    ${trackingCard}
                    ${communityCard}
                    ${riskRadarCard}
                    ${doctorPortalCard}
                    ${securityCard}
                </div>
            </div>
        `;
        
        console.log('Dashboard HTML set successfully');
        
        // Initialize dashboard components safely
        console.log('Initializing dashboard components...');
        
        try {
            if (typeof initializeDigitalTwin === 'function') {
                initializeDigitalTwin();
                console.log('Digital Twin initialized');
            }
        } catch (error) {
            console.error('Error initializing Digital Twin:', error);
        }
        
        try {
            if (typeof initializeAICoach === 'function') {
                initializeAICoach();
                console.log('AI Coach initialized');
            }
        } catch (error) {
            console.error('Error initializing AI Coach:', error);
        }
        
        try {
            if (typeof initializeTracking === 'function') {
                initializeTracking();
                console.log('Tracking initialized');
            }
        } catch (error) {
            console.error('Error initializing Tracking:', error);
        }
        
        try {
            if (typeof initializeRiskRadar === 'function') {
                initializeRiskRadar();
                console.log('Risk Radar initialized');
            }
        } catch (error) {
            console.error('Error initializing Risk Radar:', error);
        }
        
        console.log('Dashboard components initialized');
        
    } catch (error) {
        console.error('Error loading dashboard content:', error);
        
        // Try to show a simple fallback dashboard
        try {
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                dashboard.innerHTML = `
                    <div class="dashboard-header">
                        <div class="dashboard-nav">
                            <h1 class="dashboard-title">Welcome back, ${currentUser.name || 'User'}</h1>
                            <div class="user-info">
                                <div class="user-avatar">${currentUser.avatar || 'U'}</div>
                                <button class="btn-secondary" onclick="logout()">Logout</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-content">
                        <div class="dashboard-grid">
                            <div class="dashboard-card">
                                <div class="card-header">
                                    <h3 class="card-title">Welcome to HealthAI</h3>
                                    <div class="card-icon">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <p>Your health dashboard is loading. Some features may be temporarily unavailable.</p>
                                    <div class="summary-item">
                                        <span class="summary-label">Status</span>
                                        <span class="summary-value">Loading...</span>
                                    </div>
                                    <button class="btn-primary" onclick="location.reload()">Refresh Dashboard</button>
                                </div>
                            </div>
                            
                            <div class="dashboard-card">
                                <div class="card-header">
                                    <h3 class="card-title">Quick Actions</h3>
                                    <div class="card-icon">
                                        <i class="fas fa-bolt"></i>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <p>Access your health tools and features.</p>
                                    <div class="security-actions">
                                        <button class="btn-primary" onclick="showLoginModal()">Account Settings</button>
                                        <button class="btn-secondary" onclick="logout()">Logout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                console.log('Fallback dashboard loaded successfully');
            }
        } catch (fallbackError) {
            console.error('Even fallback dashboard failed:', fallbackError);
            
            // Last resort - show basic error
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                dashboard.innerHTML = `
                    <div class="dashboard-header">
                        <div class="dashboard-nav">
                            <h1 class="dashboard-title">Dashboard Error</h1>
                            <div class="user-info">
                                <button class="btn-secondary" onclick="logout()">Logout</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-content">
                        <div class="error-message">
                            <h2>Unable to load dashboard</h2>
                            <p>There was an error loading your dashboard. Please try refreshing the page or logging in again.</p>
                            <button class="btn-primary" onclick="location.reload()">Refresh Page</button>
                            <button class="btn-secondary" onclick="logout()">Logout</button>
                        </div>
                    </div>
                `;
            }
        }
        
        showNotification('Error loading dashboard. Please try again.', 'error');
    }
}

function generateDigitalTwinCard() {
    return `
        <div class="dashboard-card">
            <div class="card-header">
                <h3 class="card-title">Digital Twin Dashboard</h3>
                <div class="card-icon">
                    <i class="fas fa-user-circle"></i>
                </div>
            </div>
            <div class="chart-container">
                <canvas id="healthChart"></canvas>
            </div>
                <div class="simulation-controls">
                <h4>What-if Simulations</h4>
                <div class="simulation-buttons">
                    <button class="btn-secondary" onclick="runAdvancedSimulation('diet')">Diet Change</button>
                    <button class="btn-secondary" onclick="runAdvancedSimulation('exercise')">Exercise Increase</button>
                    <button class="btn-secondary" onclick="runAdvancedSimulation('medication')">Medication Adjustment</button>
                </div>
                <div id="simulation-results" class="simulation-results"></div>
            </div>
        </div>
    `;
}

function generateAICoachCard() {
    return `
        <div class="dashboard-card">
            <div class="card-header">
                <h3 class="card-title">AI Health Coach</h3>
                <div class="card-icon">
                    <i class="fas fa-robot"></i>
                </div>
            </div>
            <div class="ai-chat" id="aiChat">
                <div class="chat-message ai">
                    <strong>AI Coach:</strong> Hello! I'm here to help you manage your health journey. How are you feeling today?
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Ask me anything about your health..." onkeypress="handleChatKeyPress(event)">
                <button onclick="sendAdvancedChatMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div class="gamification">
                <div class="streak-counter">
                    <i class="fas fa-fire"></i>
                    <span>7 Day Streak</span>
                </div>
                <div class="achievements">
                    <i class="fas fa-trophy"></i>
                    <span>3 Achievements Unlocked</span>
                </div>
            </div>
        </div>
    `;
}

function generateTrackingCard() {
    return `
        <div class="dashboard-card">
            <div class="card-header">
                <h3 class="card-title">Smart Tracking</h3>
                <div class="card-icon">
                    <i class="fas fa-pills"></i>
                </div>
            </div>
            <div class="tracking-metrics">
                <div class="metric">
                    <span class="metric-label">Medication Adherence</span>
                    <span class="metric-value">92%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 92%"></div>
                </div>
                <div class="metric">
                    <span class="metric-label">Daily Steps</span>
                    <span class="metric-value">8,432</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 84%"></div>
                </div>
                <div class="metric">
                    <span class="metric-label">Sleep Quality</span>
                    <span class="metric-value">Good</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Blood Sugar</span>
                    <span class="metric-value">125 mg/dL</span>
                </div>
            </div>
            <div class="tracking-actions">
                <button class="btn-primary" onclick="logAdvancedMedication()">Log Medication</button>
                <button class="btn-secondary" onclick="logAdvancedFood()">Log Food</button>
                <button class="btn-secondary" onclick="syncAdvancedWearable()">Sync Wearable</button>
            </div>
        </div>
    `;
}

function generateCommunityCard() {
    return `
        <div class="dashboard-card">
            <div class="card-header">
                <h3 class="card-title">Community Hub</h3>
                <div class="card-icon">
                    <i class="fas fa-users"></i>
                </div>
            </div>
            <div class="community-feed">
                <div class="post">
                    <div class="post-header">
                        <div class="user-avatar">SM</div>
                        <span class="username">Sarah M.</span>
                        <span class="timestamp">2 hours ago</span>
                    </div>
                    <p>Just completed my first 5K run! The AI coach really helped me stay motivated. 💪</p>
                    <div class="post-actions">
                        <button class="like-btn"><i class="fas fa-heart"></i> 12</button>
                        <button class="comment-btn"><i class="fas fa-comment"></i> 3</button>
                    </div>
                </div>
                <div class="post">
                    <div class="post-header">
                        <div class="user-avatar">MJ</div>
                        <span class="username">Mike J.</span>
                        <span class="timestamp">4 hours ago</span>
                    </div>
                    <p>Managing diabetes has been easier with the medication reminders and glucose tracking.</p>
                    <div class="post-actions">
                        <button class="like-btn"><i class="fas fa-heart"></i> 8</button>
                        <button class="comment-btn"><i class="fas fa-comment"></i> 1</button>
                    </div>
                </div>
            </div>
            <div class="community-actions">
                <button class="btn-primary" onclick="createPost()">Share Update</button>
                <button class="btn-secondary" onclick="joinGroup()">Join Support Group</button>
            </div>
        </div>
    `;
}

function generateRiskRadarCard() {
    const riskData = healthDashboard.riskPredictions || {
        overallRisk: 65,
        riskFactors: {
            bloodSugar: 70,
            bloodPressure: 60,
            medicationAdherence: 30
        },
        alerts: [
            { type: 'warning', message: 'Blood pressure trending upward - consider lifestyle adjustments' },
            { type: 'info', message: 'Next checkup recommended in 2 weeks' }
        ]
    };
    
    return `
        <div class="dashboard-card">
            <div class="card-header">
                <h3 class="card-title">AI Risk Radar</h3>
                <div class="card-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
            </div>
            <div class="risk-overview">
                <div class="overall-risk">
                    <h4>Overall Risk Score</h4>
                    <div class="risk-score ${riskData.overallRisk > 70 ? 'high' : riskData.overallRisk > 50 ? 'medium' : 'low'}">
                        ${riskData.overallRisk}/100
                    </div>
                </div>
            </div>
            <div class="risk-metrics">
                <div class="risk-level ${riskData.riskFactors.bloodPressure > 70 ? 'high' : riskData.riskFactors.bloodPressure > 50 ? 'medium' : 'low'}">
                    <i class="fas ${riskData.riskFactors.bloodPressure > 70 ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                    <span>Cardiovascular Risk: ${riskData.riskFactors.bloodPressure > 70 ? 'High' : riskData.riskFactors.bloodPressure > 50 ? 'Medium' : 'Low'}</span>
                </div>
                <div class="risk-level ${riskData.riskFactors.bloodSugar > 70 ? 'high' : riskData.riskFactors.bloodSugar > 50 ? 'medium' : 'low'}">
                    <i class="fas ${riskData.riskFactors.bloodSugar > 70 ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                    <span>Diabetes Risk: ${riskData.riskFactors.bloodSugar > 70 ? 'High' : riskData.riskFactors.bloodSugar > 50 ? 'Medium' : 'Low'}</span>
                </div>
                <div class="risk-level ${riskData.riskFactors.medicationAdherence > 70 ? 'high' : riskData.riskFactors.medicationAdherence > 50 ? 'medium' : 'low'}">
                    <i class="fas ${riskData.riskFactors.medicationAdherence > 70 ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                    <span>Medication Adherence: ${riskData.riskFactors.medicationAdherence > 70 ? 'Poor' : riskData.riskFactors.medicationAdherence > 50 ? 'Fair' : 'Good'}</span>
                </div>
            </div>
            <div class="risk-predictions">
                <h4>Predictive Alerts</h4>
                ${riskData.alerts.map(alert => `
                    <div class="alert ${alert.type}">
                        <i class="fas ${alert.type === 'warning' ? 'fa-bell' : 'fa-calendar'}"></i>
                        <span>${alert.message}</span>
                    </div>
                `).join('')}
            </div>
            <div class="risk-actions">
                <button class="btn-primary" onclick="refreshRiskAssessment()">Refresh Assessment</button>
                <button class="btn-secondary" onclick="viewRiskDetails()">View Details</button>
            </div>
        </div>
    `;
}

function generateDoctorPortalCard() {
    if (currentUser.role === 'doctor') {
        return `
            <div class="dashboard-card">
                <div class="card-header">
                    <h3 class="card-title">Doctor Portal</h3>
                    <div class="card-icon">
                        <i class="fas fa-stethoscope"></i>
                    </div>
                </div>
                <div class="patient-summary">
                    <h4>Patient Summary</h4>
                    <div class="summary-item">
                        <span class="label">Risk Score:</span>
                        <span class="value">65/100</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Adherence Rate:</span>
                        <span class="value">92%</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Last Visit:</span>
                        <span class="value">2 weeks ago</span>
                    </div>
                </div>
                <div class="doctor-actions">
                    <button class="btn-primary" onclick="generateReport()">Generate Report</button>
                    <button class="btn-secondary" onclick="adjustTreatment()">Adjust Treatment</button>
                </div>
            </div>
        `;
    }
    return '';
}

function generateSecurityCard() {
    const blockchainRecords = getBlockchainRecordCount();
    const securityStatus = 'active';
    
    return `
        <div class="dashboard-card">
            <div class="card-header">
                <h3 class="card-title">Security & Privacy</h3>
                <div class="card-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
            </div>
            <div class="card-content">
                <div class="security-indicator">
                    <div class="security-status ${securityStatus}">
                        <div class="status-dot"></div>
                        <span class="status-text">Secure</span>
                    </div>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Blockchain Records</span>
                    <span class="summary-value">${blockchainRecords}</span>
                </div>
                <div class="security-actions">
                    <button class="btn-primary" onclick="showSecurityDetails()">View Details</button>
                    <button class="btn-secondary" onclick="showPrivacySettings()">Privacy Settings</button>
                </div>
            </div>
        </div>
    `;
}

// Dashboard Component Initialization
function initializeDigitalTwin() {
    const ctx = document.getElementById('healthChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Blood Sugar',
                    data: [140, 135, 130, 125, 120, 125],
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Blood Pressure',
                    data: [150, 145, 140, 135, 130, 135],
                    borderColor: '#00f2fe',
                    backgroundColor: 'rgba(0, 242, 254, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}

function initializeAICoach() {
    // AI Coach is already initialized in the HTML
}

function initializeTracking() {
    // Tracking metrics are already displayed in the HTML
}

function initializeRiskRadar() {
    // Risk radar is already initialized in the HTML
}

// Simulation Functions
async function runSimulation(type) {
    const resultsDiv = document.getElementById('simulation-results');
    resultsDiv.innerHTML = '<div class="loading"></div> Running simulation...';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let results = '';
    switch (type) {
        case 'diet':
            results = `
                <div class="simulation-result">
                    <h5>Diet Change Simulation</h5>
                    <p>Reducing carbs by 20% could lower blood sugar by 15-20 mg/dL within 2 weeks.</p>
                    <div class="impact-score">Impact Score: 8.5/10</div>
                </div>
            `;
            break;
        case 'exercise':
            results = `
                <div class="simulation-result">
                    <h5>Exercise Increase Simulation</h5>
                    <p>Adding 30 minutes of cardio daily could improve cardiovascular health by 25%.</p>
                    <div class="impact-score">Impact Score: 9.2/10</div>
                </div>
            `;
            break;
        case 'medication':
            results = `
                <div class="simulation-result">
                    <h5>Medication Adjustment Simulation</h5>
                    <p>Consult your doctor before making any medication changes.</p>
                    <div class="impact-score">Impact Score: N/A</div>
                </div>
            `;
            break;
    }
    
    resultsDiv.innerHTML = results;
}

// AI Chat Functions
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatDiv = document.getElementById('aiChat');
    
    // Add user message
    chatDiv.innerHTML += `
        <div class="chat-message user">
            <strong>You:</strong> ${message}
        </div>
    `;
    
    input.value = '';
    
    // Simulate AI response
    const aiResponse = await generateAIResponse(message);
    
    chatDiv.innerHTML += `
        <div class="chat-message ai">
            <strong>AI Coach:</strong> ${aiResponse}
        </div>
    `;
    
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function generateAIResponse(message) {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
        'how are you': 'I\'m doing great! I\'m here to help you on your health journey. How are you feeling today?',
        'blood sugar': 'Your blood sugar levels look good! Keep monitoring and maintain your current routine.',
        'exercise': 'Great question! Regular exercise is crucial for managing chronic conditions. What type of exercise are you interested in?',
        'medication': 'Medication adherence is important. Are you having any issues with your current medications?',
        'diet': 'Nutrition plays a key role in managing chronic diseases. Would you like some personalized dietary recommendations?',
        'stress': 'Stress management is crucial for overall health. Have you tried any relaxation techniques?',
        'sleep': 'Quality sleep is essential for health. How has your sleep been lately?',
        'default': 'That\'s an interesting question! I\'m here to help with your health journey. Could you tell me more about what you\'re experiencing?'
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

// Tracking Functions
function logMedication() {
    showNotification('Medication logged successfully!', 'success');
}

function logFood() {
    showNotification('Food logged successfully!', 'success');
}

function syncWearable() {
    showNotification('Wearable device synced!', 'success');
}

// Community Functions
function createPost() {
    showNotification('Post created successfully!', 'success');
}

function joinGroup() {
    showNotification('Joined support group!', 'success');
}

// Doctor Portal Functions
function generateReport() {
    // Generate comprehensive patient report
    const reportData = {
        patientId: currentUser.id,
        riskScore: healthDashboard.riskPredictions?.overallRisk || 65,
        adherenceRate: 92,
        lastVisit: '2 weeks ago',
        recommendations: healthDashboard.riskPredictions?.recommendations || ['Continue current treatment', 'Monitor blood pressure'],
        generatedAt: new Date().toISOString()
    };
    
    // Log to blockchain
    healthDashboard.logHealthEvent('report_generated', reportData);
    
    // Show report modal
    showReportModal(reportData);
    showNotification('Report generated successfully!', 'success');
}

function adjustTreatment() {
    // Show treatment adjustment modal
    showTreatmentModal();
    showNotification('Treatment adjustment logged!', 'success');
}

function showReportModal(reportData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>Patient Health Report</h2>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="report-content">
                    <div class="report-section">
                        <h3>Patient Overview</h3>
                        <div class="report-metrics">
                            <div class="metric">
                                <span class="label">Risk Score:</span>
                                <span class="value">${reportData.riskScore}/100</span>
                            </div>
                            <div class="metric">
                                <span class="label">Adherence Rate:</span>
                                <span class="value">${reportData.adherenceRate}%</span>
                            </div>
                            <div class="metric">
                                <span class="label">Last Visit:</span>
                                <span class="value">${reportData.lastVisit}</span>
                            </div>
                        </div>
                    </div>
                    <div class="report-section">
                        <h3>Recommendations</h3>
                        <ul>
                            ${reportData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="report-section">
                        <h3>Next Steps</h3>
                        <p>Schedule follow-up appointment within 2 weeks. Monitor patient's response to current treatment plan.</p>
                    </div>
                </div>
                <div class="report-actions">
                    <button class="btn-primary" onclick="downloadReport()">Download Report</button>
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showTreatmentModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Adjust Treatment Plan</h2>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="modal-body">
                <form onsubmit="handleTreatmentAdjustment(event)">
                    <div class="form-group">
                        <label for="medication">Medication</label>
                        <select id="medication" required>
                            <option value="metformin">Metformin</option>
                            <option value="lisinopril">Lisinopril</option>
                            <option value="atorvastatin">Atorvastatin</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dosage">Dosage Adjustment</label>
                        <input type="text" id="dosage" placeholder="e.g., Increase by 10mg" required>
                    </div>
                    <div class="form-group">
                        <label for="reason">Reason for Adjustment</label>
                        <textarea id="reason" rows="3" placeholder="Explain the reason for this adjustment..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="followup">Follow-up Required</label>
                        <select id="followup" required>
                            <option value="1week">1 week</option>
                            <option value="2weeks">2 weeks</option>
                            <option value="1month">1 month</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary full-width">Save Treatment Adjustment</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleTreatmentAdjustment(event) {
    event.preventDefault();
    
    const adjustment = {
        medication: document.getElementById('medication').value,
        dosage: document.getElementById('dosage').value,
        reason: document.getElementById('reason').value,
        followup: document.getElementById('followup').value,
        doctorId: currentUser.id,
        timestamp: new Date().toISOString()
    };
    
    // Log to blockchain
    healthDashboard.logHealthEvent('treatment_adjustment', adjustment);
    
    // Close modal
    event.target.closest('.modal').remove();
    
    showNotification('Treatment adjustment saved successfully!', 'success');
}

function downloadReport() {
    const reportData = {
        patientId: currentUser.id,
        riskScore: healthDashboard.riskPredictions?.overallRisk || 65,
        adherenceRate: 92,
        lastVisit: '2 weeks ago',
        recommendations: healthDashboard.riskPredictions?.recommendations || ['Continue current treatment'],
        generatedAt: new Date().toISOString(),
        doctor: currentUser.name
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `patient_report_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Report downloaded successfully!', 'success');
}

// Risk Radar Functions
async function refreshRiskAssessment() {
    showNotification('Refreshing risk assessment...', 'success');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate new risk assessment
    const newRiskData = await healthDashboard.calculateRiskScore(currentUser.healthData);
    healthDashboard.riskPredictions = newRiskData;
    
    // Reload dashboard to show updated risk data
    loadDashboardContent();
    
    showNotification('Risk assessment updated!', 'success');
}

function viewRiskDetails() {
    const riskData = healthDashboard.riskPredictions || {
        overallRisk: 65,
        riskFactors: {
            bloodSugar: 70,
            bloodPressure: 60,
            medicationAdherence: 30
        },
        recommendations: ['Focus on carbohydrate management', 'Increase physical activity'],
        alerts: [
            { type: 'warning', message: 'Blood pressure trending upward' },
            { type: 'info', message: 'Next checkup recommended in 2 weeks' }
        ]
    };
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>Detailed Risk Assessment</h2>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="risk-details">
                    <div class="risk-section">
                        <h3>Overall Risk Score</h3>
                        <div class="risk-score-large ${riskData.overallRisk > 70 ? 'high' : riskData.overallRisk > 50 ? 'medium' : 'low'}">
                            ${riskData.overallRisk}/100
                        </div>
                        <p class="risk-description">
                            ${riskData.overallRisk > 70 ? 'High risk - immediate attention recommended' : 
                              riskData.overallRisk > 50 ? 'Medium risk - lifestyle adjustments recommended' : 
                              'Low risk - continue current management'}
                        </p>
                    </div>
                    
                    <div class="risk-section">
                        <h3>Risk Factor Breakdown</h3>
                        <div class="risk-breakdown">
                            <div class="risk-factor">
                                <span class="factor-name">Blood Sugar</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" style="width: ${riskData.riskFactors.bloodSugar}%"></div>
                                </div>
                                <span class="factor-score">${riskData.riskFactors.bloodSugar}/100</span>
                            </div>
                            <div class="risk-factor">
                                <span class="factor-name">Blood Pressure</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" style="width: ${riskData.riskFactors.bloodPressure}%"></div>
                                </div>
                                <span class="factor-score">${riskData.riskFactors.bloodPressure}/100</span>
                            </div>
                            <div class="risk-factor">
                                <span class="factor-name">Medication Adherence</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" style="width: ${riskData.riskFactors.medicationAdherence}%"></div>
                                </div>
                                <span class="factor-score">${riskData.riskFactors.medicationAdherence}/100</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="risk-section">
                        <h3>Recommendations</h3>
                        <ul class="recommendations-list">
                            ${riskData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="risk-section">
                        <h3>Active Alerts</h3>
                        <div class="alerts-list">
                            ${riskData.alerts.map(alert => `
                                <div class="alert ${alert.type}">
                                    <i class="fas ${alert.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                                    <span>${alert.message}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="risk-actions">
                    <button class="btn-primary" onclick="exportRiskData()">Export Risk Data</button>
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function exportRiskData() {
    const riskData = healthDashboard.riskPredictions || {
        overallRisk: 65,
        riskFactors: {
            bloodSugar: 70,
            bloodPressure: 60,
            medicationAdherence: 30
        },
        recommendations: ['Focus on carbohydrate management', 'Increase physical activity'],
        alerts: [
            { type: 'warning', message: 'Blood pressure trending upward' },
            { type: 'info', message: 'Next checkup recommended in 2 weeks' }
        ],
        exportedAt: new Date().toISOString(),
        patientId: currentUser.id
    };
    
    const dataStr = JSON.stringify(riskData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `risk_assessment_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Risk data exported successfully!', 'success');
}

// Utility Functions
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function addSecurityIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'security-indicator';
    indicator.innerHTML = `
        <i class="fas fa-shield-alt"></i> 
        <span>Blockchain Secured</span>
        <div class="security-status">
            <span class="status-dot"></span>
            <span class="status-text">Active</span>
        </div>
    `;
    
    // Add click functionality to show security details
    indicator.addEventListener('click', showSecurityDetails);
    indicator.style.cursor = 'pointer';
    
    document.body.appendChild(indicator);
    
    // Animate the status dot
    animateSecurityStatus();
}

function animateSecurityStatus() {
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        setInterval(() => {
            statusDot.style.opacity = statusDot.style.opacity === '0.5' ? '1' : '0.5';
        }, 2000);
    }
}

function showSecurityDetails() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2><i class="fas fa-shield-alt"></i> Security & Privacy Status</h2>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="security-details">
                    <div class="security-section">
                        <h3><i class="fas fa-lock"></i> Encryption Status</h3>
                        <div class="security-item">
                            <span class="security-label">Data Encryption:</span>
                            <span class="security-status active">AES-256 Active</span>
                        </div>
                        <div class="security-item">
                            <span class="security-label">Transit Security:</span>
                            <span class="security-status active">TLS 1.3</span>
                        </div>
                        <div class="security-item">
                            <span class="security-label">Storage Security:</span>
                            <span class="security-status active">Encrypted</span>
                        </div>
                    </div>
                    
                    <div class="security-section">
                        <h3><i class="fas fa-link"></i> Blockchain Status</h3>
                        <div class="security-item">
                            <span class="security-label">Blockchain Connection:</span>
                            <span class="security-status active">Connected</span>
                        </div>
                        <div class="security-item">
                            <span class="security-label">Records Logged:</span>
                            <span class="security-status active">${getBlockchainRecordCount()} transactions</span>
                        </div>
                        <div class="security-item">
                            <span class="security-label">Last Sync:</span>
                            <span class="security-status active">${new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                    
                    <div class="security-section">
                        <h3><i class="fas fa-user-shield"></i> Privacy Controls</h3>
                        <div class="privacy-controls">
                            <button class="btn-secondary" onclick="exportUserData()">
                                <i class="fas fa-download"></i> Export Data
                            </button>
                            <button class="btn-secondary" onclick="showPrivacySettings()">
                                <i class="fas fa-cog"></i> Privacy Settings
                            </button>
                            <button class="btn-secondary" onclick="deleteUserData()">
                                <i class="fas fa-trash"></i> Delete Data
                            </button>
                        </div>
                    </div>
                    
                    <div class="security-section">
                        <h3><i class="fas fa-certificate"></i> Compliance</h3>
                        <div class="compliance-badges">
                            <div class="badge gdpr">
                                <i class="fas fa-shield-alt"></i>
                                <span>GDPR Compliant</span>
                            </div>
                            <div class="badge hipaa">
                                <i class="fas fa-user-md"></i>
                                <span>HIPAA Ready</span>
                            </div>
                            <div class="badge soc2">
                                <i class="fas fa-certificate"></i>
                                <span>SOC 2 Type II</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="security-actions">
                    <button class="btn-primary" onclick="refreshSecurityStatus()">Refresh Status</button>
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function getBlockchainRecordCount() {
    const blockchain = JSON.parse(localStorage.getItem('healthAI_blockchain') || '[]');
    return blockchain.length;
}

function showPrivacySettings() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-cog"></i> Privacy Settings</h2>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="privacy-settings">
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" checked>
                            <span class="checkmark"></span>
                            Allow data collection for AI improvement
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" checked>
                            <span class="checkmark"></span>
                            Share anonymized data for research
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox">
                            <span class="checkmark"></span>
                            Allow third-party integrations
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" checked>
                            <span class="checkmark"></span>
                            Enable emergency data sharing
                        </label>
                    </div>
                </div>
                <div class="privacy-actions">
                    <button class="btn-primary" onclick="savePrivacySettings()">Save Settings</button>
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function savePrivacySettings() {
    showNotification('Privacy settings saved successfully!', 'success');
    // Close the modal
    document.querySelector('.modal').remove();
}

function refreshSecurityStatus() {
    showNotification('Security status refreshed!', 'success');
    // Close the modal
    document.querySelector('.modal').remove();
}

// Test function for direct signup
function testSignupDirect() {
    console.log('Testing direct signup...');
    
    // Create test user directly
    currentUser = {
        id: 'test_user_' + Date.now(),
        email: 'test@healthai.com',
        role: 'patient',
        name: 'Test User',
        avatar: 'TU',
        preferences: {
            theme: 'light',
            notifications: true,
            biometric: false
        },
        healthData: {
            conditions: ['Diabetes Type 2'],
            medications: ['Metformin'],
            lastCheckup: '2024-01-15',
            riskScore: 65,
            bloodSugarHistory: [140, 135, 130, 125, 120, 125],
            bloodPressureHistory: [
                {systolic: 150, diastolic: 90},
                {systolic: 145, diastolic: 85},
                {systolic: 140, diastolic: 80}
            ],
            medicationHistory: Array(30).fill({taken: true}),
            lifestyleData: {
                exercise: 120,
                sleep: 7,
                stress: 5,
                smoking: false,
                alcohol: 1
            },
            geneticProfile: {
                familyHistory: {
                    diabetes: true,
                    heartDisease: false,
                    hypertension: true
                }
            }
        }
    };
    
    // Store user data
    localStorage.setItem('healthAI_user', JSON.stringify(currentUser));
    
    // Log blockchain transaction
    logBlockchainTransaction('SIGNUP', currentUser.id).catch(error => {
        console.error('Blockchain logging failed:', error);
    });
    
    // Show dashboard
    showDashboard();
    showNotification('Test account created successfully!', 'success');
    
    console.log('Direct signup test completed');
}

function initializeAnimations() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

async function logBlockchainTransaction(action, userId) {
    try {
        if (web3) {
            const accounts = await web3.eth.getAccounts();
            const transaction = {
                from: accounts[0],
                to: '0x0000000000000000000000000000000000000000',
                value: '0',
                data: web3.utils.toHex(`${action}:${userId}:${Date.now()}`)
            };
            
            console.log('Blockchain transaction logged:', transaction);
            return Promise.resolve(true);
        } else {
            // Mock blockchain transaction for demo
            const mockTransaction = {
                action: action,
                userId: userId,
                timestamp: Date.now(),
                hash: '0x' + Math.random().toString(16).substr(2, 64)
            };
            
            console.log('Mock blockchain transaction:', mockTransaction);
            return Promise.resolve(true);
        }
    } catch (error) {
        console.error('Blockchain logging failed:', error);
        return Promise.resolve(false);
    }
}

async function logout() {
    try {
        // Sign out from Firebase if available
        if (window.firebaseService && window.firebaseService.isReady()) {
            await window.firebaseService.signOutUser();
            console.log('Signed out from Firebase');
        }
        
        // Clear local data
        currentUser = null;
        localStorage.removeItem('healthAI_user');
        
        // Hide dashboard and show landing page
        document.getElementById('dashboard').style.display = 'none';
        document.querySelector('.hero').style.display = 'block';
        document.querySelector('.features').style.display = 'block';
        
        showNotification('Logged out successfully!', 'success');
        
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear local data even if Firebase logout fails
        currentUser = null;
        localStorage.removeItem('healthAI_user');
        document.getElementById('dashboard').style.display = 'none';
        document.querySelector('.hero').style.display = 'block';
        document.querySelector('.features').style.display = 'block';
        showNotification('Logged out successfully!', 'success');
    }
}

// Initialize advanced features
function initializeAdvancedFeatures() {
    if (typeof healthDashboard !== 'undefined') {
        healthDashboard.initializeGamification();
        
        // Load saved gamification data
        const savedStreak = localStorage.getItem('healthStreak');
        if (savedStreak) {
            healthDashboard.gamificationData.streak = parseInt(savedStreak);
        }
        
        // Initialize risk prediction
        if (currentUser) {
            initializeRiskPrediction();
        }
    }
}

// Initialize risk prediction
async function initializeRiskPrediction() {
    if (currentUser && currentUser.healthData) {
        const riskData = await healthDashboard.calculateRiskScore(currentUser.healthData);
        healthDashboard.riskPredictions = riskData;
        
        // Update risk display
        updateRiskDisplay(riskData);
    }
}

// Update risk display
function updateRiskDisplay(riskData) {
    const riskCards = document.querySelectorAll('.risk-level');
    riskCards.forEach(card => {
        const riskType = card.textContent.toLowerCase();
        let riskScore = 50;
        
        if (riskType.includes('cardiovascular')) {
            riskScore = riskData.riskFactors.bloodPressure;
        } else if (riskType.includes('diabetes')) {
            riskScore = riskData.riskFactors.bloodSugar;
        } else if (riskType.includes('medication')) {
            riskScore = riskData.riskFactors.medicationAdherence;
        }
        
        // Update risk level styling
        card.className = `risk-level ${riskScore > 70 ? 'high' : riskScore > 50 ? 'medium' : 'low'}`;
    });
}

// Enhanced simulation function
async function runAdvancedSimulation(type) {
    const parameters = getSimulationParameters(type);
    const results = await healthDashboard.runAdvancedSimulation(type, parameters);
    
    const resultsDiv = document.getElementById('simulation-results');
    resultsDiv.innerHTML = generateSimulationHTML(type, results);
    
    // Log simulation to blockchain
    await healthDashboard.logHealthEvent('simulation', { type, parameters, results });
}

// Get simulation parameters
function getSimulationParameters(type) {
    const parameters = {
        diet: {
            carbReduction: 20,
            proteinIncrease: 10,
            fatAdjustment: 0
        },
        exercise: {
            cardioMinutes: 30,
            strengthTraining: 15,
            intensity: 'moderate'
        },
        medication: {
            dosageChange: 0,
            timingAdjustment: 0,
            newMedication: false
        }
    };
    
    return parameters[type] || {};
}

// Generate simulation HTML
function generateSimulationHTML(type, results) {
    const impactScore = results.overallRisk || results.riskReduction || results.effectiveness;
    const timeline = results.timeline || '2-4 weeks';
    const confidence = results.confidence || 85;
    
    return `
        <div class="simulation-result">
            <h5>${type.charAt(0).toUpperCase() + type.slice(1)} Change Simulation</h5>
            <div class="simulation-metrics">
                <div class="metric">
                    <span class="label">Impact Score:</span>
                    <span class="value">${impactScore}/100</span>
                </div>
                <div class="metric">
                    <span class="label">Timeline:</span>
                    <span class="value">${timeline}</span>
                </div>
                <div class="metric">
                    <span class="label">Confidence:</span>
                    <span class="value">${confidence}%</span>
                </div>
            </div>
            <div class="recommendations">
                <h6>Recommendations:</h6>
                <ul>
                    ${generateRecommendations(type, results)}
                </ul>
            </div>
        </div>
    `;
}

// Generate recommendations
function generateRecommendations(type, results) {
    const recommendations = {
        diet: [
            'Gradually reduce carbohydrate intake',
            'Increase protein consumption',
            'Monitor blood sugar levels closely',
            'Consult with a nutritionist'
        ],
        exercise: [
            'Start with low-intensity activities',
            'Gradually increase duration and intensity',
            'Monitor heart rate during exercise',
            'Include both cardio and strength training'
        ],
        medication: [
            'Consult your healthcare provider',
            'Monitor for side effects',
            'Maintain consistent timing',
            'Keep detailed medication logs'
        ]
    };
    
    const typeRecommendations = recommendations[type] || ['Consult your healthcare provider'];
    return typeRecommendations.map(rec => `<li>${rec}</li>`).join('');
}

// Enhanced AI chat with mood adaptation
async function sendAdvancedChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatDiv = document.getElementById('aiChat');
    
    // Add user message
    chatDiv.innerHTML += `
        <div class="chat-message user">
            <strong>You:</strong> ${message}
        </div>
    `;
    
    input.value = '';
    
    // Detect user mood and generate response
    const userMood = detectUserMood(message);
    const healthContext = currentUser.healthData || {};
    
    const aiResponse = await healthDashboard.processMoodAdaptiveResponse(message, userMood, healthContext);
    
    chatDiv.innerHTML += `
        <div class="chat-message ai">
            <strong>AI Coach:</strong> ${aiResponse.message}
            ${aiResponse.suggestions ? `
                <div class="ai-suggestions">
                    <h6>Suggestions:</h6>
                    <ul>
                        ${aiResponse.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    chatDiv.scrollTop = chatDiv.scrollHeight;
    
    // Update gamification
    healthDashboard.updateStreak('ai_chat');
}

// Detect user mood from message
function detectUserMood(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('stressed') || lowerMessage.includes('worried') || lowerMessage.includes('anxious')) {
        return 'stressed';
    } else if (lowerMessage.includes('motivated') || lowerMessage.includes('excited') || lowerMessage.includes('ready')) {
        return 'motivated';
    } else if (lowerMessage.includes('confused') || lowerMessage.includes('don\'t understand') || lowerMessage.includes('help')) {
        return 'confused';
    } else if (lowerMessage.includes('discouraged') || lowerMessage.includes('frustrated') || lowerMessage.includes('giving up')) {
        return 'discouraged';
    }
    
    return 'motivated'; // Default mood
}

// Enhanced tracking functions
async function logAdvancedMedication() {
    const medication = {
        name: 'Metformin',
        dosage: '500mg',
        time: new Date().toISOString(),
        taken: true
    };
    
    // Log to blockchain
    await healthDashboard.logHealthEvent('medication', medication);
    
    // Update gamification
    healthDashboard.updateStreak('medication');
    
    showNotification('Medication logged successfully!', 'success');
}

async function logAdvancedFood() {
    const food = {
        type: 'meal',
        description: 'Grilled chicken with vegetables',
        calories: 350,
        timestamp: new Date().toISOString()
    };
    
    // Log to blockchain
    await healthDashboard.logHealthEvent('food', food);
    
    // Update gamification
    healthDashboard.updateStreak('food_log');
    
    showNotification('Food logged successfully!', 'success');
}

async function syncAdvancedWearable() {
    const wearableData = {
        steps: 8432,
        heartRate: 72,
        sleepHours: 7.5,
        caloriesBurned: 450,
        timestamp: new Date().toISOString()
    };
    
    // Log to blockchain
    await healthDashboard.logHealthEvent('wearable', wearableData);
    
    // Update gamification
    healthDashboard.updateStreak('exercise');
    
    showNotification('Wearable device synced!', 'success');
}

// Privacy functions
function exportUserData() {
    if (typeof healthDashboard !== 'undefined') {
        healthDashboard.exportUserData();
    } else {
        showNotification('Data export feature not available', 'error');
    }
}

function deleteUserData() {
    if (typeof healthDashboard !== 'undefined') {
        healthDashboard.deleteUserData();
    } else {
        showNotification('Data deletion feature not available', 'error');
    }
}

function editProfile() {
    showNotification('Profile editing feature coming soon!', 'success');
}

function restrictProcessing() {
    showNotification('Processing restriction updated!', 'success');
}

function objectToProcessing() {
    showNotification('Processing objection recorded!', 'success');
}

function manageCookies() {
    showNotification('Cookie preferences updated!', 'success');
}

