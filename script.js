class PomodoroTimer {
    constructor() {
        this.settings = {
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            autoStart: false,
            soundEnabled: true
        };
        
        this.state = {
            currentSession: 'work', // 'work', 'shortBreak', 'longBreak'
            sessionCount: 1,
            timeRemaining: this.settings.workDuration * 60,
            isRunning: false,
            intervalId: null
        };
        
        this.elements = {
            timeDisplay: document.getElementById('time-display'),
            sessionType: document.getElementById('session-type'),
            sessionCount: document.getElementById('session-count'),
            startPauseBtn: document.getElementById('start-pause-btn'),
            resetBtn: document.getElementById('reset-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            progressCircle: document.querySelector('.progress-ring-circle'),
            container: document.querySelector('.container')
        };
        
        this.modal = {
            element: document.getElementById('settings-modal'),
            workDuration: document.getElementById('work-duration'),
            shortBreakDuration: document.getElementById('short-break-duration'),
            longBreakDuration: document.getElementById('long-break-duration'),
            autoStart: document.getElementById('auto-start'),
            soundEnabled: document.getElementById('sound-enabled'),
            saveBtn: document.getElementById('save-settings'),
            closeBtn: document.querySelector('.close')
        };
        
        this.initializeProgressRing();
        this.bindEvents();
        this.loadSettings();
        this.updateDisplay();
        this.updateSessionClass();
    }
    
    initializeProgressRing() {
        const circle = this.elements.progressCircle;
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        this.circumference = circumference;
    }
    
    bindEvents() {
        this.elements.startPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
        this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        
        this.modal.closeBtn.addEventListener('click', () => this.closeSettings());
        this.modal.saveBtn.addEventListener('click', () => this.saveSettings());
        
        // Close modal when clicking outside
        this.modal.element.addEventListener('click', (e) => {
            if (e.target === this.modal.element) {
                this.closeSettings();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.modal.element.style.display === 'block') {
                e.preventDefault();
                this.toggleTimer();
            }
        });
    }
    
    toggleTimer() {
        if (this.state.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        this.state.isRunning = true;
        this.elements.startPauseBtn.textContent = 'Pause';
        
        this.state.intervalId = setInterval(() => {
            this.state.timeRemaining--;
            this.updateDisplay();
            this.updateProgress();
            
            if (this.state.timeRemaining <= 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.state.isRunning = false;
        this.elements.startPauseBtn.textContent = 'Start';
        clearInterval(this.state.intervalId);
    }
    
    resetTimer() {
        this.pauseTimer();
        this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
        this.updateDisplay();
        this.updateProgress();
    }
    
    completeSession() {
        this.pauseTimer();
        this.playNotificationSound();
        this.elements.container.classList.add('session-complete');
        
        setTimeout(() => {
            this.elements.container.classList.remove('session-complete');
        }, 500);
        
        if (this.state.currentSession === 'work') {
            if (this.state.sessionCount % 4 === 0) {
                this.switchToSession('longBreak');
            } else {
                this.switchToSession('shortBreak');
            }
            this.state.sessionCount++;
        } else {
            this.switchToSession('work');
        }
        
        if (this.settings.autoStart) {
            setTimeout(() => this.startTimer(), 1000);
        }
    }
    
    switchToSession(sessionType) {
        this.state.currentSession = sessionType;
        this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
        this.updateDisplay();
        this.updateProgress();
        this.updateSessionClass();
    }
    
    getCurrentSessionDuration() {
        switch (this.state.currentSession) {
            case 'work':
                return this.settings.workDuration;
            case 'shortBreak':
                return this.settings.shortBreakDuration;
            case 'longBreak':
                return this.settings.longBreakDuration;
            default:
                return this.settings.workDuration;
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.state.timeRemaining / 60);
        const seconds = this.state.timeRemaining % 60;
        this.elements.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const sessionNames = {
            work: 'Work Session',
            shortBreak: 'Short Break',
            longBreak: 'Long Break'
        };
        this.elements.sessionType.textContent = sessionNames[this.state.currentSession];
        this.elements.sessionCount.textContent = this.state.sessionCount;
    }
    
    updateProgress() {
        const totalDuration = this.getCurrentSessionDuration() * 60;
        const progress = (totalDuration - this.state.timeRemaining) / totalDuration;
        const offset = this.circumference - (progress * this.circumference);
        this.elements.progressCircle.style.strokeDashoffset = offset;
    }
    
    updateSessionClass() {
        this.elements.container.className = 'container';
        this.elements.container.classList.add(`${this.state.currentSession.toLowerCase()}-session`);
    }
    
    playNotificationSound() {
        if (!this.settings.soundEnabled) return;
        
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }
    
    openSettings() {
        this.modal.workDuration.value = this.settings.workDuration;
        this.modal.shortBreakDuration.value = this.settings.shortBreakDuration;
        this.modal.longBreakDuration.value = this.settings.longBreakDuration;
        this.modal.autoStart.checked = this.settings.autoStart;
        this.modal.soundEnabled.checked = this.settings.soundEnabled;
        
        this.modal.element.style.display = 'block';
    }
    
    closeSettings() {
        this.modal.element.style.display = 'none';
    }
    
    saveSettings() {
        this.settings.workDuration = parseInt(this.modal.workDuration.value);
        this.settings.shortBreakDuration = parseInt(this.modal.shortBreakDuration.value);
        this.settings.longBreakDuration = parseInt(this.modal.longBreakDuration.value);
        this.settings.autoStart = this.modal.autoStart.checked;
        this.settings.soundEnabled = this.modal.soundEnabled.checked;
        
        // Save to localStorage
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
        
        // Reset current session with new duration if not running
        if (!this.state.isRunning) {
            this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
            this.updateDisplay();
            this.updateProgress();
        }
        
        this.closeSettings();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});