import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";


const Homepage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userId"); // 로컬스토리지 정리
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };
  

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const nameFromDB = docSnap.data().name || "이름 없음"; // ✅ 지역 변수로 받기
          setName(nameFromDB); // ✅ 화면 출력용
          const userId = `${user.uid}-${nameFromDB}`; // ✅ 올바르게 결합
          console.log("User ID:", userId);
          localStorage.setItem("userId", userId); // ✅ 완전한 값 저장
        }
      }
    };
    fetchUserName();
  }, []);
  

  return (
    <div className="homepage">
      <div className="logout-button-container">
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
      <div className="homepage-hero">
        <h1 className="homepage-title">🏋️‍♂️ LIFE IS GORIP</h1>
        <p className="homepage-welcome">{name && `환영합니다, ${name}님!`}</p>
        <div className="button-container">
          <div className="homepage-card" onClick={() => navigate("/FoodManage")}>
            <h2>🍽️ 식단 관리</h2>
            <p>식단과 영양소를 분석하고 기록해요</p>
          </div>
          <div className="homepage-card" onClick={() => navigate("/RoutineManage")}>
            <h2>🏋️‍♀️ 루틴 관리</h2>
            <p>나의 운동 루틴을 확인하세요</p>
          </div>
          <div className="homepage-card" onClick={() => navigate("/Memopage")}>
            <h2>📝 메모장</h2>
            <p>운동 노하우, 보디빌딩 일지를 남겨보세요</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
