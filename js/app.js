// ===== DATA MODEL =====
let guests = [];

// Load from localStorage or use empty array
function loadGuests() {
    const stored = localStorage.getItem('nyc-waitlist');
    if (stored) {
        guests = JSON.parse(stored);
    } else {
        // Sample data for development
        guests = [
            {
                id: '1',
                firstName: 'Taylor',
                lastName: 'Smith',
                partySize: 4,
                phone: '5550123',
                notes: {
                    general: '',
                    occasions: ['Birthday'],
                    allergies: 'Peanuts only - other nuts fine'
                },
                status: 'waiting',
                createdAt: Date.now() - 1000 * 60 * 15, // 15 min ago
                notifiedAt: null,
                seatedAt: null
            },
            {
                id: '2',
                firstName: 'Alex',
                lastName: 'Rivera',
                partySize: 2,
                phone: '5550456',
                notes: {
                    general: '',
                    occasions: ['Birthday', 'Anniversary'],
                    allergies: ''
                },
                status: 'waiting',
                createdAt: Date.now() - 1000 * 60 * 10, // 10 min ago
                notifiedAt: null,
                seatedAt: null
            },
            {
                id: '3',
                firstName: 'Morgan',
                lastName: 'Chen',
                partySize: 3,
                phone: '5550789',
                notes: {
                    general: '',
                    occasions: ['VIP'],
                    allergies: 'Deathly allergic to shellfish - epipen on site'
                },
                status: 'notified',
                createdAt: Date.now() - 1000 * 60 * 20, // 20 min ago
                notifiedAt: Date.now() - 1000 * 60 * 6, // 6 min ago
                seatedAt: null
            }
        ];
        saveGuests();
    }
    renderWaitlist();
}

function saveGuests() {
    localStorage.setItem('nyc-waitlist', JSON.stringify(guests));
}

// ===== RENDER WAITLIST =====
function renderWaitlist() {
    const container = document.getElementById('waitlist-container');
    container.innerHTML = '';
    
    // Filter active guests (waiting or notified)
    const activeGuests = guests.filter(g => g.status === 'waiting' || g.status === 'notified');
    
    // Sort: waiting first (by createdAt), then notified (by notifiedAt)
    const sorted = [...activeGuests].sort((a, b) => {
        if (a.status === 'waiting' && b.status === 'notified') return -1;
        if (a.status === 'notified' && b.status === 'waiting') return 1;
        if (a.status === 'waiting' && b.status === 'waiting') {
            return a.createdAt - b.createdAt;
        }
        if (a.status === 'notified' && b.status === 'notified') {
            return a.notifiedAt - b.notifiedAt;
        }
        return 0;
    });
    
    sorted.forEach(guest => {
        container.appendChild(createGuestCard(guest));
    });
    
    // Update waiting count
    document.querySelector('.waiting-count').textContent = `(${guests.filter(g => g.status === 'waiting').length})`;
}

function createGuestCard(guest) {
    const card = document.createElement('div');
    card.className = `guest-card ${guest.status}`;
    card.dataset.id = guest.id;
    
    // Determine timer class based on status and time
    let timerClass = 'timer-waiting';
    if (guest.status === 'notified' && guest.notifiedAt) {
        const minutesSince = Math.floor((Date.now() - guest.notifiedAt) / 60000);
        if (minutesSince <= 3) timerClass = 'timer-notified-0-3';
        else if (minutesSince <= 9) timerClass = 'timer-notified-4-9';
        else timerClass = 'timer-notified-9-10';
    }
    
    // Build occasions HTML
    const occasionsHtml = guest.notes.occasions.map(occ => {
        const iconMap = {
            'Birthday': 'ri-cake-2-fill',
            'Graduation': 'ri-graduation-cap-fill',
            'Anniversary': 'ri-hearts-line',
            'Engagement': 'ri-diamond-ring-line',
            'Promotion': 'ri-award-fill',
            'First time': 'ri-sparkling-line',
            'VIP': 'ri-vip-crown-line'
        };
        return `<i class="${iconMap[occ] || 'ri-star-line'}"></i>`;
    }).join('');
    
    // Build allergy HTML if present
    const allergyHtml = guest.notes.allergies ? 
        `<div class="guest-allergy"><i class="ri-alert-line"></i> ${guest.notes.allergies}</div>` : '';
    
    card.innerHTML = `
        <div class="guest-main">
            <div class="guest-info">
                <span class="guest-name">${guest.firstName}</span>
                <span class="party-size">· Party of ${guest.partySize}</span>
            </div>
            <div class="guest-phone">
                <i class="ri-phone-line"></i> ··${guest.phone.slice(-4)}
            </div>
            <div class="guest-occasion">
                ${occasionsHtml}
            </div>
            ${allergyHtml}
        </div>
        <div class="guest-actions">
            <span class="timer-icon ${timerClass}"><i class="ri-timer-line"></i></span>
            <button class="btn btn-notify">Notify</button>
            <button class="btn btn-seat">Seated</button>
        </div>
    `;
    
    return card;
}

// ===== INIT =====
loadGuests();