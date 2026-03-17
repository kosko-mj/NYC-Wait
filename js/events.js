// ===== EVENT HANDLERS =====
import { guests, saveGuests } from './state.js';
import { renderWaitlist } from './render.js';

// Notify button
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-notify")) {
    const card = e.target.closest(".guest-card");
    const guest = guests.find(g => g.id === card.dataset.id);
    
    if (guest?.status === "waiting") {
      guest.status = "notified";
      guest.notifiedAt = Date.now();
      console.log(`SMS sent to ${guest.phone}: Your table is ready!`);
      saveGuests();
      renderWaitlist();
    }
  }
});

// Seated button
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-seat")) {
    const card = e.target.closest(".guest-card");
    const guest = guests.find(g => g.id === card.dataset.id);
    
    if (guest && (guest.status === "waiting" || guest.status === "notified")) {
      guest.status = "seated";
      guest.seatedAt = Date.now();
      saveGuests();
      renderWaitlist();
    }
  }
});

// Modal form
const occasionButtons = document.querySelectorAll(".note-btn");
const selectedOccasions = [];

occasionButtons.forEach(btn => {
  btn.addEventListener("click", function () {
    const occasion = this.dataset.note;
    const index = selectedOccasions.indexOf(occasion);
    
    if (index === -1) {
      selectedOccasions.push(occasion);
      this.style.background = "#1E40AF";
      this.style.color = "white";
    } else {
      selectedOccasions.splice(index, 1);
      this.style.background = "#F9FAFB";
      this.style.color = "#1F2937";
    }
  });
});

document.getElementById("add-guest-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const newGuest = {
    id: Date.now().toString(),
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    partySize: parseInt(document.getElementById("party-size").value),
    phone: document.getElementById("guest-phone").value.replace(/\D/g, ""),
    notes: {
      general: document.getElementById("general-notes").value,
      occasions: [...selectedOccasions],
      allergies: document.getElementById("allergy-notes").value,
    },
    status: "waiting",
    createdAt: Date.now(),
    notifiedAt: null,
    seatedAt: null,
    noShowAt: null
  };

  guests.push(newGuest);
  saveGuests();
  renderWaitlist();

  document.getElementById("guest-modal").close();
  this.reset();

  selectedOccasions.length = 0;
  occasionButtons.forEach(btn => {
    btn.style.background = "#F9FAFB";
    btn.style.color = "#1F2937";
  });
});