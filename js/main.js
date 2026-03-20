// ===== MAIN ENTRY =====
import { loadGuests, checkNoShows, setNoShowTimer } from './state.js';
import { renderWaitlist } from './render.js';
import './events.js';  // Just import to register handlers

// ===== UPDATE DATE & TIME =====
function updateDateTime() {
    const now = new Date();
    
    // Format: March 20, 2025 • 10:47 AM
    const dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit'
    };
    
    const date = now.toLocaleString('en-US', dateOptions);
    const time = now.toLocaleString('en-US', timeOptions);
    const formatted = `${date} • ${time}`;
    
    const datetimeEl = document.getElementById('current-datetime');
    if (datetimeEl) datetimeEl.textContent = formatted;
}

// ===== NO-SHOW TIMER DROPDOWN =====
const timerSelect = document.getElementById('no-show-timer');
if (timerSelect) {
    timerSelect.addEventListener('change', (e) => {
        const minutes = parseInt(e.target.value);
        setNoShowTimer(minutes);
        // Re-check existing guests with new timer
        checkNoShows(renderWaitlist);
    });
}

// ===== RESET DEMO BUTTON =====
const resetBtn = document.getElementById('reset-demo-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all data to demo state? This will clear all current guests.')) {
            localStorage.clear();
            location.reload();
        }
    });
}

// ===== INITIALIZE =====
loadGuests();
updateDateTime();
setInterval(updateDateTime, 60000);

// Start auto no-show timer (runs every 30 seconds)
setInterval(() => checkNoShows(renderWaitlist), 30000);