import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxM1uiXeXha6ELYl4dPcR0AnibWJIJlvM",
  authDomain: "global-ai-students.firebaseapp.com",
  projectId: "global-ai-students",
  storageBucket: "global-ai-students.firebasestorage.app",
  messagingSenderId: "832458249192",
  appId: "global-ai-students.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
