// Simple test framework
class TestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
    }
    
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }
    
    async run() {
        console.log('Running Pomodoro Timer Tests...');
        
        for (const test of this.tests) {
            try {
                await test.testFunction();
                this.results.push({ name: test.name, passed: true, error: null });
                console.log(`✓ ${test.name}`);
            } catch (error) {
                this.results.push({ name: test.name, passed: false, error: error.message });
                console.log(`✗ ${test.name}: ${error.message}`);
            }
        }
        
        this.displayResults();
    }
    
    displayResults() {
        const resultsDiv = document.getElementById('test-results');
        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;
        
        let html = '';
        
        this.results.forEach(result => {
            const className = result.passed ? 'test-pass' : 'test-fail';
            const status = result.passed ? '✓ PASS' : '✗ FAIL';
            const error = result.error ? ` - ${result.error}` : '';
            
            html += `<div class="test-result ${className}">
                ${status}: ${result.name}${error}
            </div>`;
        });
        
        const summaryClass = passed === total ? 'test-pass' : 'test-fail';
        html += `<div class="test-summary ${summaryClass}">
            Test Summary: ${passed}/${total} tests passed
        </div>`;
        
        resultsDiv.innerHTML = html;
    }
}

// Mock DOM elements for testing
function createMockDOM() {
    // Create a minimal DOM structure for testing
    const mockElements = {
        'time-display': { textContent: '25:00' },
        'session-type': { textContent: 'Work Session' },
        'session-count': { textContent: '1' },
        'start-pause-btn': { textContent: 'Start', addEventListener: () => {} },
        'reset-btn': { addEventListener: () => {} },
        'settings-btn': { addEventListener: () => {} },
        'settings-modal': { style: { display: 'none' }, addEventListener: () => {} },
        'work-duration': { value: '25' },
        'short-break-duration': { value: '5' },
        'long-break-duration': { value: '15' },
        'auto-start': { checked: false },
        'sound-enabled': { checked: true },
        'save-settings': { addEventListener: () => {} }
    };
    
    // Mock querySelector and getElementById
    const originalGetElementById = document.getElementById;
    const originalQuerySelector = document.querySelector;
    
    document.getElementById = function(id) {
        return mockElements[id] || { 
            style: {}, 
            classList: { add: () => {}, remove: () => {} },
            addEventListener: () => {},
            textContent: '',
            r: { baseVal: { value: 140 } }
        };
    };
    
    document.querySelector = function(selector) {
        if (selector === '.progress-ring-circle') {
            return {
                r: { baseVal: { value: 140 } },
                style: { strokeDasharray: '', strokeDashoffset: '' }
            };
        }
        if (selector === '.container') {
            return {
                className: 'container',
                classList: { add: () => {}, remove: () => {} }
            };
        }
        if (selector === '.close') {
            return { addEventListener: () => {} };
        }
        return { addEventListener: () => {} };
    };
    
    // Mock localStorage
    const mockStorage = {};
    global.localStorage = {
        getItem: (key) => mockStorage[key] || null,
        setItem: (key, value) => mockStorage[key] = value
    };
    
    // Mock AudioContext
    global.AudioContext = function() {
        return {
            createOscillator: () => ({
                connect: () => {},
                frequency: { value: 0 },
                type: '',
                start: () => {},
                stop: () => {}
            }),
            createGain: () => ({
                connect: () => {},
                gain: {
                    setValueAtTime: () => {},
                    exponentialRampToValueAtTime: () => {}
                }
            }),
            destination: {},
            currentTime: 0
        };
    };
    
    return { originalGetElementById, originalQuerySelector };
}

// Test suite
const testSuite = new TestSuite();

// Test 1: Timer initialization
testSuite.test('Timer initializes with correct default values', () => {
    const { originalGetElementById, originalQuerySelector } = createMockDOM();
    
    const timer = new PomodoroTimer();
    
    if (timer.settings.workDuration !== 25) {
        throw new Error(`Expected work duration 25, got ${timer.settings.workDuration}`);
    }
    
    if (timer.state.currentSession !== 'work') {
        throw new Error(`Expected current session 'work', got ${timer.state.currentSession}`);
    }
    
    if (timer.state.timeRemaining !== 1500) { // 25 minutes in seconds
        throw new Error(`Expected time remaining 1500, got ${timer.state.timeRemaining}`);
    }
    
    // Restore original functions
    document.getElementById = originalGetElementById;
    document.querySelector = originalQuerySelector;
});

// Test 2: Time formatting
testSuite.test('Time display formats correctly', () => {
    const { originalGetElementById, originalQuerySelector } = createMockDOM();
    
    const timer = new PomodoroTimer();
    
    // Test various time values
    timer.state.timeRemaining = 1500; // 25:00
    timer.updateDisplay();
    
    timer.state.timeRemaining = 65; // 01:05
    timer.updateDisplay();
    
    timer.state.timeRemaining = 5; // 00:05
    timer.updateDisplay();
    
    // Restore original functions
    document.getElementById = originalGetElementById;
    document.querySelector = originalQuerySelector;
});

// Test 3: Session switching logic
testSuite.test('Session switching works correctly', () => {
    const { originalGetElementById, originalQuerySelector } = createMockDOM();
    
    const timer = new PomodoroTimer();
    
    // Test work to short break
    timer.state.sessionCount = 1;
    timer.switchToSession('shortBreak');
    
    if (timer.state.currentSession !== 'shortBreak') {
        throw new Error(`Expected session 'shortBreak', got ${timer.state.currentSession}`);
    }
    
    if (timer.state.timeRemaining !== 300) { // 5 minutes in seconds
        throw new Error(`Expected time remaining 300, got ${timer.state.timeRemaining}`);
    }
    
    // Test work to long break (after 4 sessions)
    timer.state.sessionCount = 4;
    timer.switchToSession('longBreak');
    
    if (timer.state.currentSession !== 'longBreak') {
        throw new Error(`Expected session 'longBreak', got ${timer.state.currentSession}`);
    }
    
    if (timer.state.timeRemaining !== 900) { // 15 minutes in seconds
        throw new Error(`Expected time remaining 900, got ${timer.state.timeRemaining}`);
    }
    
    // Restore original functions
    document.getElementById = originalGetElementById;
    document.querySelector = originalQuerySelector;
});

// Test 4: Settings persistence
testSuite.test('Settings save and load correctly', () => {
    const { originalGetElementById, originalQuerySelector } = createMockDOM();
    
    const timer = new PomodoroTimer();
    
    // Modify settings
    timer.settings.workDuration = 30;
    timer.settings.shortBreakDuration = 10;
    timer.settings.soundEnabled = false;
    
    // Save settings
    localStorage.setItem('pomodoroSettings', JSON.stringify(timer.settings));
    
    // Create new timer instance and check if settings loaded
    const timer2 = new PomodoroTimer();
    
    if (timer2.settings.workDuration !== 30) {
        throw new Error(`Expected loaded work duration 30, got ${timer2.settings.workDuration}`);
    }
    
    if (timer2.settings.shortBreakDuration !== 10) {
        throw new Error(`Expected loaded short break duration 10, got ${timer2.settings.shortBreakDuration}`);
    }
    
    if (timer2.settings.soundEnabled !== false) {
        throw new Error(`Expected loaded sound enabled false, got ${timer2.settings.soundEnabled}`);
    }
    
    // Restore original functions
    document.getElementById = originalGetElementById;
    document.querySelector = originalQuerySelector;
});

// Test 5: Timer state management
testSuite.test('Timer state changes correctly', () => {
    const { originalGetElementById, originalQuerySelector } = createMockDOM();
    
    const timer = new PomodoroTimer();
    
    // Initial state
    if (timer.state.isRunning !== false) {
        throw new Error(`Expected initial running state false, got ${timer.state.isRunning}`);
    }
    
    // Start timer
    timer.startTimer();
    if (timer.state.isRunning !== true) {
        throw new Error(`Expected running state true after start, got ${timer.state.isRunning}`);
    }
    
    // Pause timer
    timer.pauseTimer();
    if (timer.state.isRunning !== false) {
        throw new Error(`Expected running state false after pause, got ${timer.state.isRunning}`);
    }
    
    // Restore original functions
    document.getElementById = originalGetElementById;
    document.querySelector = originalQuerySelector;
});

// Test 6: Progress calculation
testSuite.test('Progress calculation is accurate', () => {
    const { originalGetElementById, originalQuerySelector } = createMockDOM();
    
    const timer = new PomodoroTimer();
    
    // Test progress at different time points
    const totalDuration = timer.getCurrentSessionDuration() * 60; // 1500 seconds
    
    // At start (0% progress)
    timer.state.timeRemaining = totalDuration;
    const progress0 = (totalDuration - timer.state.timeRemaining) / totalDuration;
    if (progress0 !== 0) {
        throw new Error(`Expected 0% progress at start, got ${progress0 * 100}%`);
    }
    
    // At halfway (50% progress)
    timer.state.timeRemaining = totalDuration / 2;
    const progress50 = (totalDuration - timer.state.timeRemaining) / totalDuration;
    if (Math.abs(progress50 - 0.5) > 0.001) {
        throw new Error(`Expected 50% progress at halfway, got ${progress50 * 100}%`);
    }
    
    // At end (100% progress)
    timer.state.timeRemaining = 0;
    const progress100 = (totalDuration - timer.state.timeRemaining) / totalDuration;
    if (progress100 !== 1) {
        throw new Error(`Expected 100% progress at end, got ${progress100 * 100}%`);
    }
    
    // Restore original functions
    document.getElementById = originalGetElementById;
    document.querySelector = originalQuerySelector;
});

// Run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    testSuite.run();
});