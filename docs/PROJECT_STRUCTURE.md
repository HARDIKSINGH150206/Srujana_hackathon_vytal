# Project Structure Documentation

This document describes the organized structure of the HealthAI Chronic Disease Management Platform.

## 📁 Directory Structure

```
health-care/
├── 📄 README.md                    # Main project documentation
├── 📄 package.json                 # Node.js dependencies and scripts
├── 📄 .gitignore                   # Git ignore rules
├── 📄 health care.code-workspace   # VS Code workspace configuration
├── 📄 index.html                   # Legacy index file (to be removed)
│
├── 📁 pages/                       # HTML Pages
│   ├── 📄 index.html               # Main application page
│   ├── 📄 privacy-policy.html      # Privacy policy and GDPR compliance
│   ├── 📄 debug-dashboard.html     # Debug dashboard page
│   ├── 📄 debug-signup.html        # Debug signup page
│   ├── 📄 debug-signup-test.html   # Debug signup test page
│   ├── 📄 demo-without-firebase.html # Demo without Firebase
│   ├── 📄 test-dashboard-loading.html # Test dashboard loading
│   └── 📄 test-features.html       # Test features page
│
├── 📁 src/                         # Source Code
│   ├── 📁 js/                      # JavaScript Files
│   │   ├── 📄 script.js            # Core application logic
│   │   ├── 📄 dashboard-components.js # Advanced dashboard components
│   │   └── 📄 firebase-config.js   # Firebase configuration and utilities
│   ├── 📁 css/                     # Stylesheets
│   │   └── 📄 styles.css           # Main stylesheet
│   └── 📁 components/              # Reusable Components (Future)
│
├── 📁 assets/                      # Static Assets
│   ├── 📁 images/                  # Image Files
│   └── 📁 icons/                   # Icon Files
│
├── 📁 docs/                        # Documentation
│   ├── 📄 README.md                # Project documentation (moved from root)
│   ├── 📄 FIREBASE_SETUP.md        # Firebase setup guide
│   ├── 📄 DEVELOPMENT.md           # Development guide
│   └── 📄 PROJECT_STRUCTURE.md     # This file
│
├── 📁 config/                      # Configuration Files
│   └── 📄 firebase.config.js       # Firebase configuration
│
└── 📁 tests/                       # Test Files (Future)
```

## 🔄 File Organization Changes

### Before Organization
```
health-care/
├── index.html
├── privacy-policy.html
├── styles.css
├── script.js
├── dashboard-components.js
├── firebase-config.js
├── README.md
├── FIREBASE_SETUP.md
├── debug-*.html
├── demo-*.html
├── test-*.html
└── health care.code-workspace
```

### After Organization
- **HTML files** → `pages/` directory
- **JavaScript files** → `src/js/` directory
- **CSS files** → `src/css/` directory
- **Documentation** → `docs/` directory
- **Configuration** → `config/` directory
- **Assets** → `assets/` directory (ready for images/icons)

## 📝 Updated File Paths

### HTML Files
All HTML files now reference resources using relative paths:

```html
<!-- Before -->
<link rel="stylesheet" href="styles.css">
<script src="script.js"></script>

<!-- After -->
<link rel="stylesheet" href="../src/css/styles.css">
<script src="../src/js/script.js"></script>
```

### JavaScript Files
JavaScript files maintain their original functionality but are now organized in modules:

- `src/js/script.js` - Main application logic
- `src/js/dashboard-components.js` - Dashboard functionality
- `src/js/firebase-config.js` - Firebase utilities

## 🚀 Development Workflow

### Starting Development
1. Navigate to project directory
2. Run `npm start` (if Node.js is installed)
3. Or open `pages/index.html` directly in browser

### File Modifications
- **HTML**: Edit files in `pages/` directory
- **JavaScript**: Edit files in `src/js/` directory
- **CSS**: Edit files in `src/css/` directory
- **Documentation**: Edit files in `docs/` directory

## 🔧 Configuration Files

### package.json
- Defines project dependencies
- Includes development scripts
- Sets up live-server for development

### .gitignore
- Excludes sensitive files
- Prevents committing build artifacts
- Protects Firebase configuration

### firebase.config.js
- Centralized Firebase configuration
- Environment-specific settings
- Security rules definition

## 📚 Documentation Structure

### README.md (Root)
- Main project overview
- Quick start guide
- Feature descriptions

### docs/README.md
- Detailed project documentation
- Complete feature list
- Technical specifications

### docs/FIREBASE_SETUP.md
- Step-by-step Firebase setup
- Configuration instructions
- Troubleshooting guide

### docs/DEVELOPMENT.md
- Development guidelines
- Code style standards
- Testing procedures

### docs/PROJECT_STRUCTURE.md
- This file - structure documentation

## 🎯 Benefits of New Structure

### Organization
- Clear separation of concerns
- Logical file grouping
- Easy navigation

### Maintainability
- Modular architecture
- Consistent naming conventions
- Centralized configuration

### Scalability
- Ready for additional components
- Prepared for build processes
- Supports team collaboration

### Development Experience
- Clear development workflow
- Organized documentation
- Easy debugging

## 🔮 Future Enhancements

### Planned Additions
- `src/components/` - Reusable UI components
- `tests/` - Unit and integration tests
- `build/` - Build output directory
- `assets/images/` - Project images
- `assets/icons/` - Custom icons

### Build Process
- CSS preprocessing (Sass/Less)
- JavaScript bundling
- Image optimization
- Minification

## 📋 Migration Checklist

- ✅ Created organized folder structure
- ✅ Moved HTML files to `pages/`
- ✅ Moved JavaScript files to `src/js/`
- ✅ Moved CSS files to `src/css/`
- ✅ Moved documentation to `docs/`
- ✅ Created configuration files
- ✅ Updated file paths in HTML
- ✅ Created comprehensive README
- ✅ Added development documentation
- ✅ Set up package.json with scripts
- ✅ Created .gitignore file

## 🚨 Important Notes

### File Paths
All HTML files now use relative paths to reference resources. Ensure you're running the application from the correct directory structure.

### Firebase Configuration
Update `config/firebase.config.js` with your actual Firebase project configuration.

### Development Server
Use `npm start` to run the development server, or ensure you're serving files from a web server (not file:// protocol) for Firebase to work properly.

---

This structure provides a solid foundation for the HealthAI platform and supports future growth and development.

