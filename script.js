import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDt7EZPNdFR2Bk-f5UscJlzYfrAeuQIB_M",
    authDomain: "ambot-e9d94.firebaseapp.com",
    databaseURL: "https://ambot-e9d94-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ambot-e9d94",
    storageBucket: "ambot-e9d94.firebasestorage.app",
    messagingSenderId: "12083952544",
    appId: "1:12083952544:web:1af1cd97c09ca948cbc2c5",
    measurementId: "G-99VF17TSEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const wishlistRef = ref(database, "wishlist");

// Helper function to check if a string is a valid URL
const isValidURL = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// Add Wishlist Form Submission
document.getElementById("wishlistForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const codename = document.getElementById("codename").value.trim();
    const wishlistLink1 = document.getElementById("wishlistLink1").value.trim();
    const wishlistLink2 = document.getElementById("wishlistLink2").value.trim();
    const wishlistLink3 = document.getElementById("wishlistLink3").value.trim();

    const wishlistLinks = [wishlistLink1, wishlistLink2, wishlistLink3].filter(link => link !== "");

    if (codename && wishlistLinks.length > 0) {
        push(wishlistRef, { codename, wishlistLinks })
            .then(() => {
                console.log("Data added successfully");
                document.getElementById("wishlistForm").reset();
            })
            .catch((error) => console.error("Error adding data to Firebase:", error));
    } else {
        console.error("Both codename and at least one wishlist link or text are required.");
    }
});

// Display Wishlist Items
onValue(wishlistRef, (snapshot) => {
    const wishlistContainer = document.getElementById("wishlistContainer");
    wishlistContainer.innerHTML = "";

    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((key) => {
            const item = data[key];
            const wishlistDiv = document.createElement("div");
            wishlistDiv.className = "wishlist-item";

            // Format links and plain text properly
            wishlistDiv.innerHTML = `
                <strong>${item.codename}</strong><br>
                ${item.wishlistLinks.map(link => isValidURL(link) 
                    ? `<a href="${link}" target="_blank">${link}</a><br>` 
                    : `<span>${link}</span><br>`
                ).join("")}
            `;
            wishlistContainer.appendChild(wishlistDiv);
        });
    }
});
