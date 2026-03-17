// ===== RENDER FUNCTIONS =====
import { guests } from './state.js';

const iconMap = {
  Birthday: "ri-cake-2-fill",
  Graduation: "ri-graduation-cap-fill",
  Anniversary: "ri-hearts-line",
  Engagement: "ri-diamond-ring-line",
  Promotion: "ri-award-fill",
  "First time": "ri-sparkling-line",
  VIP: "ri-vip-crown-line"
};

function getTimerClass(guest) {
  if (guest.status !== 'notified' || !guest.notifiedAt) return 'timer-waiting';
  const minutesSince = Math.floor((Date.now() - guest.notifiedAt) / 60000);
  if (minutesSince <= 3) return 'timer-notified-0-3';
  if (minutesSince <= 9) return 'timer-notified-4-9';
  return 'timer-notified-9-10';
}

function createGuestCard(guest) {
  const card = document.createElement("div");
  card.className = `guest-card ${guest.status}`;
  card.dataset.id = guest.id;

  const occasionsHtml = guest.notes.occasions
    .map(occ => `<i class="${iconMap[occ] || 'ri-star-line'}"></i>`).join("");

  const allergyHtml = guest.notes.allergies
    ? `<div class="guest-allergy"><i class="ri-alert-line"></i> ${guest.notes.allergies}</div>`
    : "";

  card.innerHTML = `
    <div class="guest-main">
      <div class="guest-info">
        <span class="guest-name">${guest.firstName}</span>
        <span class="party-size">· Party of ${guest.partySize}</span>
      </div>
      <div class="guest-phone"><i class="ri-phone-line"></i> ··${guest.phone.slice(-4)}</div>
      <div class="guest-occasion">${occasionsHtml}</div>
      ${allergyHtml}
    </div>
    <div class="guest-actions">
      <span class="timer-icon ${getTimerClass(guest)}"><i class="ri-timer-line"></i></span>
      <button class="btn btn-notify">Notify</button>
      <button class="btn btn-seat">Seated</button>
    </div>
  `;
  return card;
}

function createHistoryItem(guest) {
  const item = document.createElement('div');
  item.className = 'history-item';
  
  const occasionsHtml = guest.notes.occasions
    .map(occ => `<i class="${iconMap[occ] || 'ri-star-line'}"></i>`).join(' ');
  
  const allergyHtml = guest.notes.allergies
    ? `<span class="history-allergy"><i class="ri-alert-line"></i> ${guest.notes.allergies}</span>`
    : '';
  
  const statusClass = guest.status === 'seated' ? 'seated' : 'no-show';
  const statusDisplay = guest.status === 'seated' ? 'Seated' : '<i class="ri-timer-line"></i>';
  
  item.innerHTML = `
    <div class="history-info">
      <span class="history-name">${guest.firstName} · Party of ${guest.partySize}</span>
      <span class="history-occasion">${occasionsHtml}</span>
      ${allergyHtml}
    </div>
    <span class="history-status ${statusClass}">${statusDisplay}</span>
  `;
  return item;
}

export function renderWaitlist() {
  const container = document.getElementById("waitlist-container");
  container.innerHTML = "";

  const activeGuests = guests.filter(g => g.status === "waiting" || g.status === "notified");
  
  const sorted = [...activeGuests].sort((a, b) => {
    if (a.status === "waiting" && b.status === "notified") return -1;
    if (a.status === "notified" && b.status === "waiting") return 1;
    if (a.status === "waiting" && b.status === "waiting") return a.createdAt - b.createdAt;
    if (a.status === "notified" && b.status === "notified") return b.notifiedAt - a.notifiedAt;
    return 0;
  });

  sorted.forEach(guest => container.appendChild(createGuestCard(guest)));
  document.querySelector(".waiting-count").textContent = 
    `(${guests.filter(g => g.status === "waiting").length})`;
    
  renderHistory();
}

export function renderHistory() {
  const container = document.getElementById('history-container');
  if (!container) return;
  
  container.innerHTML = '';
  const historyGuests = guests.filter(g => g.status === 'seated' || g.status === 'no-show');
  historyGuests.forEach(guest => container.appendChild(createHistoryItem(guest)));
  
  const count = document.querySelector('.history-count');
  if (count) count.textContent = `(${historyGuests.length})`;
}