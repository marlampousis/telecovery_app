// auth_status.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoSTPHW8pO8Cshz7igtGLyIqjLBXEIQBk",
  authDomain: "telecovery-569e4.firebaseapp.com",
  projectId: "telecovery-569e4",
  storageBucket: "telecovery-569e4.firebasestorage.app",
  messagingSenderId: "712084939147",
  appId: "1:712084939147:web:ac2b2cc5b87385d89bcf8e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const welcomeText = document.getElementById("welcome-text");
const introMessage = document.getElementById("intro-message");
const authLink = document.getElementById("auth-link");
const historyLink = document.getElementById("history-link");
const videoLink = document.getElementById("video-link");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;

      const { firstName, lastName, userType } = userDoc.data();

      if (welcomeText) {
        welcomeText.innerHTML = userType === "doctor"
          ? `Welcome Dr. ${lastName}!`
          : `Welcome ${firstName}!`;
      }

      if (introMessage) {
        introMessage.textContent = `Telecovery is a demo project created by Marios Lampousis and Charalampos Tsitsanos for the subject "Electronic Health Services". The project is a telemedicine informatics system for people (athletes) that are either on distant places or those who don't have time to access a doctor's office.`;
      }

      // Enable video call link
      if (videoLink) {
        videoLink.classList.remove("disabled");
        videoLink.href = "video_call.html";
      }

      // Enable history link only for doctors
      if (historyLink) {
        if (userType === "doctor") {
          historyLink.classList.remove("disabled");
          historyLink.href = "patients_history.html";
        } else {
          historyLink.classList.add("disabled");
          historyLink.href = "#";
        }
      }

      // Restrict direct access to patients_history.html if not doctor
      if (window.location.pathname.includes("patients_history.html") && userType !== "doctor") {
        alert("Δεν έχετε πρόσβαση σε αυτή τη σελίδα.");
        window.location.href = "home.html";
      }

      // Setup Logout link
      if (authLink) {
        authLink.textContent = "Logout";
        authLink.href = "#";
        authLink.addEventListener("click", (e) => {
          e.preventDefault();
          signOut(auth).then(() => {
            localStorage.removeItem("loggedInUserId");
            window.location.href = "home.html";
          });
        });
      }

    } catch (err) {
      console.error("Auth check error:", err);
      if (introMessage) introMessage.textContent = "Error loading user info.";
    }
  } else {
    // Not signed in
    if (welcomeText) {
      welcomeText.innerHTML = "Welcome to <span id='name'>Telecovery</span>";
    }
    if (introMessage) {
      introMessage.textContent = "You need to log in first!";
    }
    if (authLink) {
      authLink.textContent = "Register/Login";
      authLink.href = "login_register.html";
    }
    if (historyLink) {
      historyLink.classList.add("disabled");
      historyLink.href = "#";
    }
    if (videoLink) {
      videoLink.classList.add("disabled");
      videoLink.href = "#";
    }
  }
});
