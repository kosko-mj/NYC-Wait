// ===== MAIN ENTRY =====
import { loadGuests, checkNoShows } from './state.js';
import { renderWaitlist } from './render.js';
import './events.js';  // Just import to register handlers

// Initialize
loadGuests();
renderWaitlist();

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

// Update immediately and every minute
updateDateTime();
setInterval(updateDateTime, 60000);


// Start auto no-show timer
setInterval(() => checkNoShows(renderWaitlist), 30000);