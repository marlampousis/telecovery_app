// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
  import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDoSTPHW8pO8Cshz7igtGLyIqjLBXEIQBk",
    authDomain: "telecovery-569e4.firebaseapp.com",
    projectId: "telecovery-569e4",
    storageBucket: "telecovery-569e4.firebasestorage.app",
    messagingSenderId: "712084939147",
    appId: "1:712084939147:web:ac2b2cc5b87385d89bcf8e"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const register = document.getElementById('register-btn')
  register.addEventListener('click', (event) => {
    event.preventDefault();
    const firstName=document.getElementById('firstName').value;
    const lastName=document.getElementById('lastName').value;
    const email=document.getElementById('regEmail').value;
    const password=document.getElementById('regPsw').value;
    const userType=document.querySelector('input[name="userType"]:checked')?.value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            firstName: firstName,
            lastName: lastName,
            email: email,
            userType: userType
        };
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
          alert('Account created successfully! You may now login.');
          document.getElementById('loginBtn').click();
        });
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already exists!');
      } else {
        alert('Unable to create user: ' + error.message);
      }
    });
});
const login = document.getElementById('login-btn');
login.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('logEmail').value;
  const password = document.getElementById('logPsw').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      alert('Login successful!');
      window.location.href = 'home.html';
    })
    .catch((error) => {
      if (error.code === 'auth/invalid-credential') {
        alert('Incorrect email or password');
      } else {
        alert('Account does not exist: ' + error.message);
      }
    });
});