# Development Guide

This guide provides information for developers working on the HealthAI platform.

## 🏗️ Project Architecture

### Frontend Architecture
- **HTML**: Semantic markup with accessibility features
- **CSS**: Modular styles with CSS Grid and Flexbox
- **JavaScript**: ES6+ with modular architecture
- **Charts**: Chart.js for data visualization
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore

### File Structure
```
src/
├── js/
│   ├── script.js              # Main application logic
│   ├── dashboard-components.js # Dashboard functionality
│   └── firebase-config.js     # Firebase utilities
├── css/
│   └── styles.css            # Main stylesheet
└── components/               # Reusable components (future)
```

## 🚀 Development Setup

### Prerequisites
- Node.js 14+ (optional)
- Modern web browser
- Firebase account (for full functionality)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-care
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   This will start a live server on `http://localhost:3000`

4. **Open in browser**
   Navigate to `http://localhost:3000/pages/index.html`

### Firebase Setup

1. **Create Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Set up Firestore**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see `docs/FIREBASE_SETUP.md`)

4. **Update configuration**
   - Copy your Firebase config
   - Update `config/firebase.config.js`

## 🧪 Testing

### Manual Testing
- Test all user flows (signup, login, dashboard)
- Test responsive design on different screen sizes
- Test Firebase integration
- Test blockchain features (if MetaMask is available)

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Development Guidelines

### Code Style
- Use meaningful variable and function names
- Add comments for complex logic
- Follow consistent indentation (2 spaces)
- Use ES6+ features

### CSS Guidelines
- Use CSS Grid and Flexbox for layouts
- Follow BEM methodology for class naming
- Use CSS custom properties for theming
- Keep styles modular and maintainable

### JavaScript Guidelines
- Use const/let instead of var
- Use arrow functions where appropriate
- Handle errors gracefully
- Use async/await for asynchronous operations

## 📦 Build Process

Currently, the project doesn't have a build process as it's a client-side application. Future enhancements may include:

- CSS preprocessing (Sass/Less)
- JavaScript bundling (Webpack/Vite)
- Image optimization
- Minification

## 🐛 Debugging

### Common Issues

1. **Firebase not initialized**
   - Check Firebase configuration
   - Ensure Firebase services are enabled
   - Check browser console for errors

2. **CORS errors**
   - Use a local server (not file://)
   - Check Firebase configuration

3. **Chart.js errors**
   - Ensure Chart.js is loaded
   - Check canvas element exists

### Debug Tools
- Browser Developer Tools
- Firebase Console
- Chart.js documentation
- Web3.js documentation

## 🔒 Security Considerations

### Client-Side Security
- Never expose API keys in client code
- Validate all user inputs
- Use HTTPS in production
- Implement proper error handling

### Firebase Security
- Set up proper Firestore security rules
- Use Firebase App Check for additional security
- Monitor authentication logs

## 📱 Responsive Design

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1199px
- Desktop: 1200px+

### Testing
- Use browser dev tools device emulation
- Test on actual devices when possible
- Check touch interactions on mobile

## 🎨 UI/UX Guidelines

### Design Principles
- Accessibility first
- Mobile-first approach
- Consistent spacing and typography
- Clear visual hierarchy

### Color Scheme
- Primary: #4facfe (blue)
- Secondary: #00f2fe (cyan)
- Accent: #667eea (purple)
- Text: #2d3748 (dark gray)
- Background: #f8fafc (light gray)

### Typography
- Font family: Inter (Google Fonts)
- Font weights: 300, 400, 500, 600, 700
- Line height: 1.6

## 🚀 Deployment

### Static Hosting
The application can be deployed to any static hosting service:

- **Firebase Hosting**: `firebase deploy`
- **Netlify**: Connect GitHub repository
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Enable in repository settings

### Environment Variables
For production deployment, update:
- Firebase configuration
- API endpoints
- Feature flags

## 📊 Performance Optimization

### Current Optimizations
- Lazy loading of images
- Efficient CSS selectors
- Minimal JavaScript bundle

### Future Optimizations
- Code splitting
- Image optimization
- Service worker for caching
- CDN for static assets

## 🔄 Version Control

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push to remote
6. Create pull request

### Commit Messages
Use conventional commit format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` test additions/changes

## 📚 Resources

### Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

### Tools
- [Firebase Console](https://console.firebase.google.com/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [VS Code](https://code.visualstudio.com/)

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Review Process
- All changes require review
- Tests must pass
- Code must follow style guidelines
- Documentation must be updated

---

For more information, see the main [README.md](../README.md) file.

