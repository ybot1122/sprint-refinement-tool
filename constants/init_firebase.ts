import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export default function initFirebase() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAkAoQwj7x-ux8tJBwNMI9SqDGgP_iLLIs",
    authDomain: "sprint-refinement-tool.firebaseapp.com",
    projectId: "sprint-refinement-tool",
    storageBucket: "sprint-refinement-tool.firebasestorage.app",
    messagingSenderId: "1095173776899",
    appId: "1:1095173776899:web:fcd77161ba7eaf60ffd036",
    measurementId: "G-RMS1S0Q9PE",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  return { app, analytics };
}
