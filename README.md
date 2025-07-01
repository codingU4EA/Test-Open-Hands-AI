# Pomodoro Timer Web Application

A responsive web-based Pomodoro timer application built to help users manage their time using the Pomodoro Technique. This project was created as part of issue #1 to demonstrate a complete web application with modern responsive design.

## Features

### Core Functionality
- **25-minute work sessions** with visual countdown timer
- **5-minute short breaks** between work sessions  
- **15-minute long breaks** after every 4 work sessions
- **Session counter** to track completed Pomodoros
- **Start/Pause/Reset controls** for timer management

### User Interface
- **Responsive design** that works on desktop, tablet, and mobile
- **Visual progress indicator** with animated circular progress ring
- **Clean, modern interface** with intuitive controls
- **Session type indicators** with color-coded themes
- **Smooth animations** and transitions

### Customization
- **Adjustable timer durations** for work and break periods
- **Auto-start options** for seamless workflow
- **Sound notifications** with mute/unmute capability
- **Settings persistence** using browser localStorage

## Getting Started

### Running the Application

1. **Simple HTTP Server (Python)**:
   ```bash
   python3 server.py
   ```
   Then visit: http://localhost:12000

2. **Alternative - Any HTTP Server**:
   ```bash
   # Using Python's built-in server
   python3 -m http.server 8000
   
   # Using Node.js http-server (if installed)
   npx http-server
   ```

### File Structure
```
├── index.html          # Main application HTML
├── styles.css          # Responsive CSS styles
├── script.js           # JavaScript application logic
├── server.py           # Simple Python HTTP server
├── PRD.md             # Product Requirements Document
├── tests/             # Test suite
│   ├── test.html      # Browser-based test runner
│   ├── test-suite.js  # Comprehensive test suite
│   └── simple-test.js # Core functionality tests
└── README.md          # This file
```

## Usage

1. **Start a Session**: Click the "Start" button to begin a 25-minute work session
2. **Pause/Resume**: Click "Pause" to pause the timer, "Start" to resume
3. **Reset**: Click "Reset" to restart the current session
4. **Settings**: Click "Settings" to customize timer durations and preferences
5. **Session Flow**: The app automatically transitions between work and break sessions

### Keyboard Shortcuts
- **Spacebar**: Start/Pause the timer

## Technical Details

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **CSS Grid and Flexbox** for flexible layouts
- **Breakpoints**: 
  - Mobile: < 480px
  - Tablet: 480px - 768px  
  - Desktop: > 768px

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Uses Web Audio API for notifications
- localStorage for settings persistence

### Performance
- Lightweight vanilla JavaScript (no frameworks)
- Minimal resource usage
- Fast loading times
- Smooth 60fps animations

## Testing

The application includes comprehensive tests covering:

### Core Functionality Tests
```bash
cd tests
node simple-test.js
```

Tests include:
- Timer logic and time formatting
- Session duration calculations
- Progress calculation accuracy
- Session switching logic

### Browser Tests
Open `tests/test.html` in a browser to run the full test suite including:
- Timer initialization
- Settings persistence
- State management
- Progress ring calculations

## Development

### Architecture
- **Class-based JavaScript** with clear separation of concerns
- **Event-driven design** for user interactions
- **State management** for timer and session tracking
- **Modular CSS** with responsive design patterns

### Key Components
- `PomodoroTimer` class: Main application logic
- Progress ring SVG: Visual timer representation
- Settings modal: User customization interface
- Responsive layout: Mobile-first design system

## Future Enhancements

See `PRD.md` for detailed future feature plans including:
- Session statistics and analytics
- Task integration and notes
- Browser notifications
- Progressive Web App (PWA) capabilities
- Custom themes and colors

## Contributing

This project follows standard web development practices:
1. Test your changes using the provided test suite
2. Ensure responsive design works across devices
3. Maintain clean, readable code
4. Update tests for new functionality

## License

This project is part of the Test-Open-Hands-AI repository for demonstrating AI-assisted development capabilities.
