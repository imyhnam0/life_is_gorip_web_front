// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ 추가
import { getFirestore } from "firebase/firestore"; // ✅ Firestore 추가
// import { getAnalytics } from "firebase/analytics"; // ⚠️ 개발 중이면 이 줄 주석 처리해도 됨

const firebaseConfig = {
  apiKey: "AIzaSyBfJbLDJTCzbP155rUcHu5WCVzP27sZaiY",
  authDomain: "summer-eebb6.firebaseapp.com",
  projectId: "summer-eebb6",
  storageBucket: "summer-eebb6.appspot.com",
  messagingSenderId: "697245684494",
  appId: "1:697245684494:web:92ea4bd106aadbd98bbd5f",
  measurementId: "G-50RWGH3FCE"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 인증 객체 생성
export const auth = getAuth(app);
export const db = getFirestore(app);

// analytics는 HTTPS 환경에서만 동작하므로 개발 중이면 생략 가능
// const analytics = getAnalytics(app); // ⚠️ 필요할 때만 사용
