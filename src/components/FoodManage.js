import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./FoodManage.css";
import { debounce } from "lodash";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FoodManage = () => {
  const [date, setDate] = useState(new Date());
  const [foodEntries, setFoodEntries] = useState([]);
  const [showInput, setShowInput] = useState(false);

  const formattedDate = date.toISOString().split("T")[0];
  const userId = localStorage.getItem("userId");

  // 🔸 더미 영양 정보
  const dummyNutrition = {
    carbs: 250,
    protein: 180,
    fat: 60,
    calories: 2200
  };

  // 저장
  const saveToDB = async () => {
    const foodText = foodEntries
      .filter(entry => entry.food && entry.grams)
      .map(entry => `${entry.food} ${entry.grams}g`)
      .join(", ");

    try {
      await fetch("http://localhost:8080/api/saveFoodLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          foodText,
          userId
        })
      });
      console.log("자동 저장 완료");
    } catch (err) {
      console.error("자동 저장 실패:", err);
    }
  };

  const debouncedSave = useCallback(debounce(saveToDB, 800), [foodEntries, formattedDate]);

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setShowInput(true);

    const formatted = newDate.toISOString().split("T")[0];
    try {
      const res = await fetch(`http://localhost:8080/api/getFoodLog?userId=${userId}&date=${formatted}`);
      if (res.status === 204) {
        setFoodEntries([]);
        return;
      }
      const data = await res.json();
      if (data && data.foodText) {
        const entries = data.foodText.split(",").map(item => {
          const [food, gramsText] = item.trim().split(" ");
          return { food, grams: gramsText?.replace("g", "") || "" };
        });
        setFoodEntries(entries);
      } else {
        setFoodEntries([]);
      }
    } catch (err) {
      console.error("기록 불러오기 실패:", err);
      setFoodEntries([]);
    }
  };

  const handleChangeEntry = (index, field, value) => {
    const updated = [...foodEntries];
    updated[index][field] = value;
    setFoodEntries(updated);
    debouncedSave();
  };

  const handleAddEntry = () => {
    setFoodEntries([...foodEntries, { food: "", grams: "" }]);
  };

  const handleRemoveEntry = (index) => {
    const updated = [...foodEntries];
    updated.splice(index, 1);
    setFoodEntries(updated);
    debouncedSave();
  };

  const chartData = {
    labels: ["탄수화물", "단백질", "지방"],
    datasets: [
      {
        label: "g",
        data: [dummyNutrition.carbs, dummyNutrition.protein, dummyNutrition.fat],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };
// 🔵 차트 데이터
  return (
    <div className="food-manage-container">
      <h2 className="title">
        📅 {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일 식단 기록
      </h2>


      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        <div>
          <Calendar onChange={handleDateChange} value={date} />
          <p className="selected-date">선택한 날짜: {date.toLocaleDateString()}</p>

          {showInput && (
            <div className="input-area">
              {foodEntries.map((entry, index) => (
                <div key={index} className="food-entry-row">
                  <input
                    type="text"
                    placeholder="음식명"
                    value={entry.food}
                    onChange={(e) => handleChangeEntry(index, "food", e.target.value)}
                    className="food-input"
                  />
                  <input
                    type="number"
                    placeholder="그램수"
                    value={entry.grams}
                    onChange={(e) => handleChangeEntry(index, "grams", e.target.value)}
                    className="grams-input"
                  />
                  <button onClick={() => handleRemoveEntry(index)}>🗑</button>
                </div>
              ))}
              <button onClick={handleAddEntry} className="add-entry-button">＋ 음식 추가</button>
            </div>
          )}
        </div>

        {/* 🔵 원형 차트 & 정보 */}
        <div style={{ minWidth: "300px", textAlign: "center" }}>
          <h3>영양 비율 (더미)</h3>
          <Doughnut data={chartData} />
          <div style={{ marginTop: "20px", fontSize: "16px", textAlign: "left" }}>
            <p><strong>총 칼로리:</strong> {dummyNutrition.calories} kcal</p>
            <p><strong>탄수화물:</strong> {dummyNutrition.carbs} g</p>
            <p><strong>단백질:</strong> {dummyNutrition.protein} g</p>
            <p><strong>지방:</strong> {dummyNutrition.fat} g</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodManage;
