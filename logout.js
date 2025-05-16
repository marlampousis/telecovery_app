 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
 import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
 import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js"

 const firebaseConfig = {
    apiKey: "AIzaSyDoSTPHW8pO8Cshz7igtGLyIqjLBXEIQBk",
    authDomain: "telecovery-569e4.firebaseapp.com",
    projectId: "telecovery-569e4",
    storageBucket: "telecovery-569e4.firebasestorage.app",
    messagingSenderId: "712084939147",
    appId: "1:712084939147:web:ac2b2cc5b87385d89bcf8e"
 };

 const app = initializeApp(firebaseConfig);
 const auth=getAuth();
 const db=getFirestore();

 const introMessage = document.getElementById("intro-message");
 const welcomeText = document.getElementById("welcome-text");
 const authLink = document.getElementById("auth-link");
 const protectedLinks = document.querySelectorAll(".protected-link")
 const historyLink = document.getElementById("history-link");
 const videoLink = document.getElementById("video-link");

 onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const { firstName, lastName, userType } = userData;

          if (userType === "doctor") {
              welcomeText.innerHTML = `Welcome Dr. ${lastName}!`;
            } else {
              welcomeText.innerHTML = `Welcome ${firstName}!`;
          }

          introMessage.textContent = 'Telecovery is a demo project created by Marios Lampousis and Charalampos Tsitsanos for the subject "Electronic Health Services". The project is a telemedicine informatics system for people (athletes) that are either on distant places or those who don\'t have time to access a doctor\'s office.';

          if (videoLink) {
            videoLink.classList.remove("disabled");
            videoLink.href = "video_call.html";
          }

          if (historyLink) {
            if (userType === "doctor") {
              historyLink.classList.remove("disabled");
              historyLink.href = "patients_history.html";
            } else {
              historyLink.classList.add("disabled");
              historyLink.href = "#";
            }
          }

          if (window.location.pathname.includes("patients_history.html") && userType !== "doctor") {
            alert("Δεν έχετε πρόσβαση σε αυτή τη σελίδα.");
            window.location.href = "home.html";
          }

          authLink.textContent = "Logout";
            authLink.href = "#";
            authLink.addEventListener("click", (e) => {
              e.preventDefault();
              signOut(auth).then(() => {
                localStorage.removeItem("loggedInUserId");
                window.location.href = "home.html";
              });
            });
          } else {
            introMessage.textContent = "User data not found.";
          }
        } catch (err) {
          console.error("Error getting user data:", err);
          introMessage.textContent = "Error loading user information.";
        }
      } else {
        // Not logged in
        welcomeText.innerHTML = "Welcome to <span id='name'>Telecovery</span>";
        introMessage.textContent = "You need to log in first!";
        historyLink.classList.add("disabled");
        videoLink.classList.add("disabled");
        historyLink.href = "#";
        videoLink.href = "#";
        authLink.textContent = "Register/Login";
        authLink.href = "login_register.html";
      }
    });
