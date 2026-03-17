// ===== MAIN ENTRY =====
import { loadGuests, checkNoShows } from './state.js';
import { renderWaitlist } from './render.js';
import './events.js';  // Just import to register handlers

// Initialize
loadGuests();
renderWaitlist();

// Start auto no-show timer
setInterval(() => checkNoShows(renderWaitlist), 30000);