// Firebase configuration (replace with your Firebase config)
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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Reference to the wishlist in the database
const wishlistRef = database.ref("wishlist");

// Handle form submission
document.getElementById("wishlistForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const codename = document.getElementById("codename").value.trim();
    const wishlistLink = document.getElementById("wishlistLink").value.trim();

    if (codename && wishlistLink) {
        // Push data to Firebase
        wishlistRef.push({ codename, wishlistLink })
            .then(() => {
                console.log("Data added successfully");
            })
            .catch((error) => {
                console.error("Error adding data to Firebase:", error);
            });

        // Clear the form
        document.getElementById("wishlistForm").reset();
    } else {
        console.error("Both codename and wishlist link are required.");
    }
});


// Listen for changes in the database and update the UI
wishlistRef.on("value", (snapshot) => {
    const wishlistContainer = document.getElementById("wishlistContainer");
    wishlistContainer.innerHTML = ""; // Clear previous content

    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((key) => {
            const item = data[key];
            const wishlistDiv = document.createElement("div");
            wishlistDiv.className = "wishlist-item";
            wishlistDiv.innerHTML = `
                <strong>${item.codename}</strong><br>
                <a href="${item.wishlistLink}" target="_blank">${item.wishlistLink}</a>
            `;
            wishlistContainer.appendChild(wishlistDiv);
        });
    }
});
