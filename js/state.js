// ===== STATE MANAGEMENT =====
export let guests = [];

export function loadGuests() {
  const stored = localStorage.getItem("nyc-waitlist");
  if (stored) {
    guests = JSON.parse(stored);
  } else {
    // Sample data
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
        createdAt: Date.now() - 1000 * 60 * 15,
        notifiedAt: null,
        seatedAt: null,
        noShowAt: null
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
        createdAt: Date.now() - 1000 * 60 * 10,
        notifiedAt: null,
        seatedAt: null,
        noShowAt: null
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
        createdAt: Date.now() - 1000 * 60 * 20,
        notifiedAt: Date.now() - 1000 * 60 * 6,
        seatedAt: null,
        noShowAt: null
      },
    ];
    saveGuests();
  }
}

export function saveGuests() {
  localStorage.setItem("nyc-waitlist", JSON.stringify(guests));
}

export function checkNoShows(renderCallback) {
  let changed = false;
  
  guests.forEach(guest => {
    if (guest.status === 'notified' && guest.notifiedAt) {
      const minutesSince = (Date.now() - guest.notifiedAt) / 60000;
      if (minutesSince >= 10) {
        guest.status = 'no-show';
        guest.noShowAt = Date.now();
        changed = true;
        console.log(`Auto no-show: ${guest.firstName} ${guest.lastName}`);
      }
    }
  });
  
  if (changed) {
    saveGuests();
    renderCallback();
  }
}