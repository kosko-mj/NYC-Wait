// ===== DATA MODEL =====
let guests = [];

// Load from localStorage or use empty array
function loadGuests() {
  const stored = localStorage.getItem("nyc-waitlist");
  if (stored) {
    guests = JSON.parse(stored);
  } else {
    // Sample data for development
    guests = [
      {
        id: "1",
        firstName: "Taylor",
        lastName: "Smith",
        partySize: 4,
        phone: "5550123",
        notes: {
          general: "",
          occasions: ["Birthday"],
          allergies: "Peanuts only - other nuts fine",
        },
        status: "waiting",
        createdAt: Date.now() - 1000 * 60 * 15, // 15 min ago
        notifiedAt: null,
        seatedAt: null,
      },
      {
        id: "2",
        firstName: "Alex",
        lastName: "Rivera",
        partySize: 2,
        phone: "5550456",
        notes: {
          general: "",
          occasions: ["Birthday", "Anniversary"],
          allergies: "",
        },
        status: "waiting",
        createdAt: Date.now() - 1000 * 60 * 10, // 10 min ago
        notifiedAt: null,
        seatedAt: null,
      },
      {
        id: "3",
        firstName: "Morgan",
        lastName: "Chen",
        partySize: 3,
        phone: "5550789",
        notes: {
          general: "",
          occasions: ["VIP"],
          allergies: "Deathly allergic to shellfish - epipen on site",
        },
        status: "notified",
        createdAt: Date.now() - 1000 * 60 * 20, // 20 min ago
        notifiedAt: Date.now() - 1000 * 60 * 6, // 6 min ago
        seatedAt: null,
      },
    ];
    saveGuests();
  }
  renderWaitlist();
}

function saveGuests() {
  localStorage.setItem("nyc-waitlist", JSON.stringify(guests));
}

// ===== RENDER HISTORY =====
function renderHistory() {
  const historyContainer = document.getElementById('history-container');
  if (!historyContainer) return;
  
  historyContainer.innerHTML = '';
  
  const historyGuests = guests.filter(g => g.status === 'seated' || g.status === 'no-show');
  
  historyGuests.forEach(guest => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // Build occasions HTML
    const occasionsHtml = guest.notes.occasions.map(occ => {
      const iconMap = {
        Birthday: 'ri-cake-2-fill',
        Anniversary: 'ri-hearts-line',
        VIP: 'ri-vip-crown-line'
      };
      return `<i class="${iconMap[occ] || 'ri-star-line'}"></i>`;
    }).join(' ');
    
    // Build allergy HTML if present
    const allergyHtml = guest.notes.allergies ? 
      `<span class="history-allergy"><i class="ri-alert-line"></i> ${guest.notes.allergies}</span>` : '';
    
    const statusClass = guest.status === 'seated' ? 'seated' : 'no-show';
    const statusDisplay = guest.status === 'seated' ? 'Seated' : '<i class="ri-timer-line"></i>';
    
    historyItem.innerHTML = `
      <div class="history-info">
        <span class="history-name">${guest.firstName} · Party of ${guest.partySize}</span>
        <span class="history-occasion">${occasionsHtml}</span>
        ${allergyHtml}
      </div>
      <span class="history-status ${statusClass}">${statusDisplay}</span>
    `;
    
    historyContainer.appendChild(historyItem);
  });
  
  // Update history count
  const historyCount = document.querySelector('.history-count');
  if (historyCount) {
    historyCount.textContent = `(${historyGuests.length})`;
  }
}

// ===== RENDER WAITLIST =====
function renderWaitlist() {
  const container = document.getElementById("waitlist-container");
  container.innerHTML = "";

  // Filter active guests (waiting or notified)
  const activeGuests = guests.filter(
    (g) => g.status === "waiting" || g.status === "notified",
  );

  // Sort: waiting first (by createdAt), then notified (newest first)
  const sorted = [...activeGuests].sort((a, b) => {
    if (a.status === "waiting" && b.status === "notified") return -1;
    if (a.status === "notified" && b.status === "waiting") return 1;
    if (a.status === "waiting" && b.status === "waiting") {
      return a.createdAt - b.createdAt;
    }
    if (a.status === "notified" && b.status === "notified") {
      return b.notifiedAt - a.notifiedAt;
    }
    return 0;
  });

  sorted.forEach((guest) => {
    container.appendChild(createGuestCard(guest));
  });

  // Update waiting count
  document.querySelector(".waiting-count").textContent =
    `(${guests.filter((g) => g.status === "waiting").length})`;
    
  // Update history
  renderHistory();
}

function createGuestCard(guest) {
  const card = document.createElement("div");
  card.className = `guest-card ${guest.status}`;
  card.dataset.id = guest.id;

  // Determine timer class based on status and time
  let timerClass = "timer-waiting";
  if (guest.status === "notified" && guest.notifiedAt) {
    const minutesSince = Math.floor((Date.now() - guest.notifiedAt) / 60000);
    if (minutesSince <= 3) timerClass = "timer-notified-0-3";
    else if (minutesSince <= 9) timerClass = "timer-notified-4-9";
    else timerClass = "timer-notified-9-10";
  }

  // Build occasions HTML
  const occasionsHtml = guest.notes.occasions
    .map((occ) => {
      const iconMap = {
        Birthday: "ri-cake-2-fill",
        Graduation: "ri-graduation-cap-fill",
        Anniversary: "ri-hearts-line",
        Engagement: "ri-diamond-ring-line",
        Promotion: "ri-award-fill",
        "First time": "ri-sparkling-line",
        VIP: "ri-vip-crown-line",
      };
      return `<i class="${iconMap[occ] || "ri-star-line"}"></i>`;
    })
    .join("");

  // Build allergy HTML if present
  const allergyHtml = guest.notes.allergies
    ? `<div class="guest-allergy"><i class="ri-alert-line"></i> ${guest.notes.allergies}</div>`
    : "";

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

// ===== NOTIFY BUTTON =====
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-notify")) {
    const card = e.target.closest(".guest-card");
    const guestId = card.dataset.id;
    const guest = guests.find((g) => g.id === guestId);

    if (guest && guest.status === "waiting") {
      // Update guest
      guest.status = "notified";
      guest.notifiedAt = Date.now();

      // Stub for SMS (we'll implement properly later)
      console.log(`SMS sent to ${guest.phone}: Your table is ready!`);

      // Save and re-render
      saveGuests();
      renderWaitlist();
    }
  }
});

// ===== SEATED BUTTON =====
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-seat")) {
    const card = e.target.closest(".guest-card");
    const guestId = card.dataset.id;
    const guest = guests.find((g) => g.id === guestId);

    if (guest && (guest.status === "waiting" || guest.status === "notified")) {
      // Update guest
      guest.status = "seated";
      guest.seatedAt = Date.now();

      // Save and re-render
      saveGuests();
      renderWaitlist();
    }
  }
});

// ===== ADD GUEST MODAL =====
document
  .getElementById("add-guest-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const partySize = parseInt(document.getElementById("party-size").value);
    const phone = document
      .getElementById("guest-phone")
      .value.replace(/\D/g, ""); // strip non-digits
    const generalNotes = document.getElementById("general-notes").value;
    const allergyNotes = document.getElementById("allergy-notes").value;

    // Get selected occasions from buttons
    const occasions = [...selectedOccasions];

    // Create new guest object
    const newGuest = {
      id: Date.now().toString(),
      firstName: firstName,
      lastName: lastName,
      partySize: partySize,
      phone: phone,
      notes: {
        general: generalNotes,
        occasions: occasions,
        allergies: allergyNotes,
      },
      status: "waiting",
      createdAt: Date.now(),
      notifiedAt: null,
      seatedAt: null,
    };

    // Add to array and save
    guests.push(newGuest);
    saveGuests();

    // Re-render
    renderWaitlist();

    // Close modal and reset form
    document.getElementById("guest-modal").close();
    this.reset();

    // Reset occasion buttons
    selectedOccasions.length = 0;
    occasionButtons.forEach((btn) => {
      btn.style.background = "#F9FAFB";
      btn.style.color = "#1F2937";
    });
  });

// ===== QUICK OCCASION BUTTONS =====
const occasionButtons = document.querySelectorAll(".note-btn");
const selectedOccasions = [];

occasionButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    const occasion = this.dataset.note;
    const index = selectedOccasions.indexOf(occasion);

    if (index === -1) {
      // Add occasion
      selectedOccasions.push(occasion);
      this.style.background = "#1E40AF";
      this.style.color = "white";
    } else {
      // Remove occasion
      selectedOccasions.splice(index, 1);
      this.style.background = "#F9FAFB";
      this.style.color = "#1F2937";
    }
  });
});

// ===== INIT =====
loadGuests();