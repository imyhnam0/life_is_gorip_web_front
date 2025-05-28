import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // 경로 확인

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Firebase 토큰
      localStorage.setItem("accessToken", token);
      console.log("Firebase 토큰", token);

      setLoginCheck(false);
      navigate("/Homepage");
    } catch (error) {
      console.error("로그인 실패:", error.message);
      setLoginCheck(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="title">Life is gorip</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        {loginCheck && <p className="error-message">로그인 실패. 다시 시도하세요.</p>}
        <p className="signup-link">
          <Link to="/signup">회원 가입</Link>
        </p>
        <p className="creator-credit">© 2025 Made by <span>yunhyungnam</span></p>

      </div>
    </div>
  );
};

export default Login;
