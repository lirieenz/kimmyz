import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Firebase configuration
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

// Add Wishlist form submission
document.getElementById("wishlistForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const codename = document.getElementById("codename").value.trim();
    const wishlistLink1 = document.getElementById("wishlistLink1").value.trim();
    const wishlistLink2 = document.getElementById("wishlistLink2").value.trim();
    const wishlistLink3 = document.getElementById("wishlistLink3").value.trim();

    // Extract valid URLs
    const cleanLink1 = wishlistLink1.split(" ")[0].split("(")[0];
    const cleanLink2 = wishlistLink2 ? wishlistLink2.split(" ")[0].split("(")[0] : "";
    const cleanLink3 = wishlistLink3 ? wishlistLink3.split(" ")[0].split("(")[0] : "";

    const wishlistLinks = [cleanLink1, cleanLink2, cleanLink3].filter(link => link !== "");

    if (codename && wishlistLinks.length > 0) {
        push(wishlistRef, { codename, wishlistLinks })
            .then(() => {
                console.log("Data added successfully");
            })
            .catch((error) => {
                console.error("Error adding data to Firebase:", error);
            });

        document.getElementById("wishlistForm").reset();
    } else {
        console.error("Both codename and at least one wishlist link are required.");
    }
});

// Display Wishlists
onValue(wishlistRef, (snapshot) => {
    const wishlistContainer = document.getElementById("wishlistContainer");
    wishlistContainer.innerHTML = "";

    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((key) => {
            const item = data[key];
            const wishlistDiv = document.createElement("div");
            wishlistDiv.className = "wishlist-item";

            // Process links and descriptions
            const linksHtml = item.wishlistLinks.map(link => {
                const [url, ...rest] = link.split("("); // Separate URL and description
                const description = rest.length > 0 ? ` (${rest.join("(")}` : ""; // Rejoin remaining text
                return `<a href="${url.trim()}" target="_blank">${url.trim()}</a>${description}<br>`;
            }).join("");

            wishlistDiv.innerHTML = `
                <strong>${item.codename}</strong><br>
                ${linksHtml}
            `;
            wishlistContainer.appendChild(wishlistDiv);
        });
    }
});