import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css"; // 스타일 파일 추가

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      email: email,
      password: password,
      name: username,
    };

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 200) {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        window.location.href = data.redirectUrl || "/";
      } else if (response.status === 400) {
        alert(`회원가입 실패: ${data.email}`);
      } else {
        alert(`회원가입 실패: ${data.error.message}`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>회원 가입</h2>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />

        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="signup-input"
        />

        <button type="submit" className="signup-button">
          회원 가입
        </button>

        <p className="login-link">
          이미 회원이신가요? <Link to="/">로그인</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
