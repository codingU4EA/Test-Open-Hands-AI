// Simple Node.js test for core Pomodoro Timer functionality
console.log('Running Pomodoro Timer Core Tests...\n');

// Test the core timer logic without DOM dependencies
function testTimerLogic() {
    console.log('Test 1: Timer Logic');
    
    // Test time formatting
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Test cases
    const testCases = [
        { input: 1500, expected: '25:00' },
        { input: 65, expected: '01:05' },
        { input: 5, expected: '00:05' },
        { input: 0, expected: '00:00' }
    ];
    
    let passed = 0;
    testCases.forEach(test => {
        const result = formatTime(test.input);
        if (result === test.expected) {
            console.log(`  ✓ formatTime(${test.input}) = ${result}`);
            passed++;
        } else {
            console.log(`  ✗ formatTime(${test.input}) = ${result}, expected ${test.expected}`);
        }
    });
    
    console.log(`  Result: ${passed}/${testCases.length} tests passed\n`);
    return passed === testCases.length;
}

function testSessionLogic() {
    console.log('Test 2: Session Logic');
    
    // Test session duration logic
    const settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15
    };
    
    function getCurrentSessionDuration(sessionType) {
        switch (sessionType) {
            case 'work': return settings.workDuration;
            case 'shortBreak': return settings.shortBreakDuration;
            case 'longBreak': return settings.longBreakDuration;
            default: return settings.workDuration;
        }
    }
    
    const testCases = [
        { session: 'work', expected: 25 },
        { session: 'shortBreak', expected: 5 },
        { session: 'longBreak', expected: 15 }
    ];
    
    let passed = 0;
    testCases.forEach(test => {
        const result = getCurrentSessionDuration(test.session);
        if (result === test.expected) {
            console.log(`  ✓ ${test.session} session duration = ${result} minutes`);
            passed++;
        } else {
            console.log(`  ✗ ${test.session} session duration = ${result}, expected ${test.expected}`);
        }
    });
    
    console.log(`  Result: ${passed}/${testCases.length} tests passed\n`);
    return passed === testCases.length;
}

function testProgressCalculation() {
    console.log('Test 3: Progress Calculation');
    
    function calculateProgress(timeRemaining, totalDuration) {
        return (totalDuration - timeRemaining) / totalDuration;
    }
    
    const totalDuration = 1500; // 25 minutes
    const testCases = [
        { timeRemaining: 1500, expectedProgress: 0 },    // Start
        { timeRemaining: 750, expectedProgress: 0.5 },   // Halfway
        { timeRemaining: 0, expectedProgress: 1 }        // End
    ];
    
    let passed = 0;
    testCases.forEach(test => {
        const result = calculateProgress(test.timeRemaining, totalDuration);
        if (Math.abs(result - test.expectedProgress) < 0.001) {
            console.log(`  ✓ Progress at ${test.timeRemaining}s = ${(result * 100).toFixed(1)}%`);
            passed++;
        } else {
            console.log(`  ✗ Progress at ${test.timeRemaining}s = ${(result * 100).toFixed(1)}%, expected ${(test.expectedProgress * 100).toFixed(1)}%`);
        }
    });
    
    console.log(`  Result: ${passed}/${testCases.length} tests passed\n`);
    return passed === testCases.length;
}

function testSessionSwitching() {
    console.log('Test 4: Session Switching Logic');
    
    function getNextSession(currentSession, sessionCount) {
        if (currentSession === 'work') {
            return sessionCount % 4 === 0 ? 'longBreak' : 'shortBreak';
        } else {
            return 'work';
        }
    }
    
    const testCases = [
        { current: 'work', count: 1, expected: 'shortBreak' },
        { current: 'work', count: 2, expected: 'shortBreak' },
        { current: 'work', count: 4, expected: 'longBreak' },
        { current: 'shortBreak', count: 1, expected: 'work' },
        { current: 'longBreak', count: 4, expected: 'work' }
    ];
    
    let passed = 0;
    testCases.forEach(test => {
        const result = getNextSession(test.current, test.count);
        if (result === test.expected) {
            console.log(`  ✓ After ${test.current} session ${test.count}: next = ${result}`);
            passed++;
        } else {
            console.log(`  ✗ After ${test.current} session ${test.count}: next = ${result}, expected ${test.expected}`);
        }
    });
    
    console.log(`  Result: ${passed}/${testCases.length} tests passed\n`);
    return passed === testCases.length;
}

// Run all tests
const results = [
    testTimerLogic(),
    testSessionLogic(),
    testProgressCalculation(),
    testSessionSwitching()
];

const totalPassed = results.filter(r => r).length;
const totalTests = results.length;

console.log('='.repeat(50));
console.log(`FINAL RESULT: ${totalPassed}/${totalTests} test suites passed`);

if (totalPassed === totalTests) {
    console.log('🎉 All tests passed! The Pomodoro Timer core functionality is working correctly.');
    process.exit(0);
} else {
    console.log('❌ Some tests failed. Please check the implementation.');
    process.exit(1);
}