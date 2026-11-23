
// ==================================
// HAVENSTAY JAVASCRIPT
// ==================================


// 1. ROOM SEARCH AND FILTERING
// ==================================

const searchInput = document.getElementById("roomSearch");

const roomCards = document.querySelectorAll(".room-card");

const filterButtons = document.querySelectorAll(".filter-btn");

const noResults = document.getElementById("noResults");

let selectedCategory = "all";

function filterRooms() {

    if (!searchInput || !noResults || roomCards.length === 0) {
        return;
    }

    const searchValue = searchInput.value.toLowerCase();

    let foundRooms = 0;

    roomCards.forEach(function(card) {

        const roomName = card.querySelector("h3")
            .textContent.toLowerCase();

        const category = card.dataset.category;

        const matchesSearch = roomName.includes(searchValue);

        const matchesCategory =
            !filterButtons.length ||
            selectedCategory === "all" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
            foundRooms++;
        } else {
            card.style.display = "none";
        }

    });

    noResults.hidden = foundRooms !== 0;
}

if (searchInput && noResults) {

    searchInput.addEventListener("input", filterRooms);

}

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectedCategory = button.dataset.category;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filterRooms();

    });

});


// 2. BOOKING SYSTEM
// ==================================

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    const roomType = document.getElementById("roomType");

    const checkIn = document.getElementById("checkIn");

    const checkOut = document.getElementById("checkOut");

    const guests = document.getElementById("guests");

    const nightPrice = document.getElementById("nightPrice");

    const nightCount = document.getElementById("nightCount");

    const totalPrice = document.getElementById("totalPrice");

    const bookingMessage = document.getElementById("bookingMessage");


    // Format a date using local calendar values
    function formatDate(date) {

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    // Set today's date as the earliest check-in
    const today = formatDate(new Date());

    checkIn.min = today;
    checkOut.min = today;


    // Calculate booking cost
    function calculatePrice() {

        const price = Number(roomType.value);

        const start = checkIn.value
            ? new Date(checkIn.value + "T00:00:00")
            : null;

        const end = checkOut.value
            ? new Date(checkOut.value + "T00:00:00")
            : null;

        nightPrice.textContent =
            "KSh " + price.toLocaleString("en-KE");

        let nights = 0;

        if (start && end && end > start) {

            const difference = end.getTime() - start.getTime();

            nights = difference / (1000 * 60 * 60 * 24);

        }

        const total = price * nights;

        nightCount.textContent = nights;

        totalPrice.textContent =
            "KSh " + total.toLocaleString("en-KE");

    }


    // Update checkout date restrictions
    checkIn.addEventListener("change", function() {

        checkOut.min = checkIn.value || today;

        if (checkOut.value && checkOut.value <= checkIn.value) {

            checkOut.value = "";

        }

        calculatePrice();

    });


    // Recalculate when details change
    roomType.addEventListener("change", calculatePrice);

    checkOut.addEventListener("change", calculatePrice);


    // Handle form submission
    bookingForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const start = checkIn.value;

        const end = checkOut.value;

        const guestCount = Number(guests.value);

        if (!roomType.value) {

            bookingMessage.textContent = "Please select a room.";

            return;

        }

        if (start < today || end <= start) {

            bookingMessage.textContent =
                "Please select valid check-in and check-out dates.";

            return;

        }

        if (!Number.isInteger(guestCount) ||
            guestCount < 1 || guestCount > 10) {

            bookingMessage.textContent =
                "Please enter between 1 and 10 guests.";

            return;

        }

        calculatePrice();

        bookingMessage.textContent =
            "Your booking request has been submitted successfully!";

        bookingMessage.style.color = "green";

        bookingForm.reset();

        checkIn.min = today;
        checkOut.min = today;

        calculatePrice();

    });


    // CONTACT FORM

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        const contactName = document.getElementById("contactName");
        const contactMessage = document.getElementById("contactMessage");
        const contactFeedback = document.getElementById("contactFeedback");

        contactForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const name = contactName.value.trim();
            const message = contactMessage.value.trim();

            if (name.length < 2) {
                contactFeedback.textContent =
                    "Please enter a valid name.";
                contactFeedback.style.color = "red";
                return;
            }

            if (message.length < 10) {
                contactFeedback.textContent =
                    "Your message must contain at least 10 characters.";
                contactFeedback.style.color = "red";
                return;
            }

            contactFeedback.textContent =
                "Thank you, " + name + "! Your message has been received.";

            contactFeedback.style.color = "green";

            contactForm.reset();
        });
    }

}
