import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./FoodManage.css";
import SendToGemini from "./SendToGemini"; // 경로 주의: utils에 두면 './utils/sendToGemini'

const FoodManage = () => {
  const [date, setDate] = useState(new Date());
  const [inputText, setInputText] = useState("");
  const [geminiResult, setGeminiResult] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowInput(true); // 날짜 클릭 시 입력창 보이게
    setInputText("");   // 이전 입력 초기화
  };

  const handleConfirm = async () => {
    const formattedDate = date.toISOString().split("T")[0];

    // 🔽 1. Gemini 전송 (선택)
    const geminiResponse = await SendToGemini(inputText);
    setGeminiResult(geminiResponse);

    // 🔽 2. MySQL 전송
    try {
      const response = await fetch("http://localhost:8080/api/saveFoodLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          foodText: inputText,
          userId: "exampleUserId123" // 실제 사용자 ID와 연결
        })
      });
      const result = await response.json();
      console.log("저장 성공:", result);
    } catch (error) {
      console.error("저장 실패:", error);
    }
  };

  return (
    <div className="food-manage-container">
      <h2 className="title">📅 식단 기록</h2>

      <Calendar onChange={handleDateChange} value={date} />

      <p className="selected-date">선택한 날짜: {date.toLocaleDateString()}</p>

      {showInput && (
        <div className="input-area">
          <textarea
            className="food-textarea"
            placeholder="예: 고구마 200g, 닭가슴살 150g"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
          />
          <button className="confirm-button" onClick={handleConfirm}>
            ✅ 확인 및 저장
          </button>
        </div>
      )}

      {geminiResult && (
        <div className="gemini-result">
          <h4>Gemini 응답</h4>
          <pre>{geminiResult}</pre>
        </div>
      )}
    </div>
  );
};


export default FoodManage;
