import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./RoutineManage.css";
import { auth, db } from "./firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";


const RoutineManage = () => {
    const [routineData, setRoutineData] = useState({});
    const [selectedPart, setSelectedPart] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [dailyRecord, setDailyRecord] = useState(null);
    const [routineDatesByPart, setRoutineDatesByPart] = useState({});

    const formatToKSTDate = (date) => {
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split("T")[0];
    };

    useEffect(() => {
        const fetchRoutineDatesByPart = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const snap = await getDocs(collection(db, "users", user.uid, "Calender", "health", "routines"));
            const grouped = {};

            snap.forEach((doc) => {
                const data = doc.data();
                const date = data["날짜"];
                const part = data["오늘 한 루틴이름"];

                if (!grouped[part]) grouped[part] = [];
                grouped[part].push(date);
            });

            setRoutineDatesByPart(grouped);
        };

        fetchRoutineDatesByPart();
    }, []);



    useEffect(() => {
        const fetchRoutine = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const routineDoc = doc(db, "users", user.uid, "Routine", "Myroutine");
            const snapshot = await getDoc(routineDoc);
            if (snapshot.exists()) {
                setRoutineData(snapshot.data());
            }
        };

        fetchRoutine();
    }, []);

    useEffect(() => {
        const fetchDailyRoutine = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const routinesCol = collection(db, "users", user.uid, "Calender", "health", "routines");
            const snap = await getDocs(routinesCol);

            const formatted = formatToKSTDate(calendarDate); // KST 보정
            let found = null;

            snap.forEach((doc) => {
                const data = doc.data();
                if (data.날짜 === formatted) {
                    found = data;
                }
            });

            setDailyRecord(found);
        };

        fetchDailyRoutine();
    }, [calendarDate]);

    return (
        <div className="routine-container">
            <h2 className="routine-title">🔥 나의 운동 루틴</h2>
            <div className="routine-section">
                {Object.entries(routineData).map(([part, workouts]) => (
                    <div key={part} className="routine-part">
                        <h3
                            className={`routine-part-title ${selectedPart === part ? "selected-part" : ""}`}
                            onClick={() => setSelectedPart(part === selectedPart ? null : part)}
                        >
                            -- {part}
                        </h3>
                        {selectedPart === part &&
                            workouts.map((workout, index) => {
                                const workoutName = Object.keys(workout)[0];
                                const exercises = workout[workoutName].exercises;

                                return (
                                    <div key={index} className="routine-workout">
                                        <p
                                            className="routine-workout-name"
                                            onClick={() =>
                                                setSelectedWorkout(selectedWorkout === index ? null : index)
                                            }
                                        >
                                            - {workoutName}
                                        </p>
                                        {selectedWorkout === index && (
                                            <div className="routine-sets">
                                                {exercises.map((ex, i) => (
                                                    <div key={i} className="routine-set-item">
                                                        세트 {i + 1}: {ex.reps}회 × {ex.weight}kg
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                ))}
            </div>

            <div className="calendar-box">
                <h3 className="calendar-title">📅 루틴 기록 달력</h3>
                <Calendar
                    onChange={setCalendarDate}
                    value={calendarDate}
                    className="custom-calendar"
                    tileClassName={({ date }) => {
                        const formatted = formatToKSTDate(date);
                        const matchedDates = routineDatesByPart[selectedPart] || [];

                        return matchedDates.includes(formatted) ? "highlighted-day" : null;
                    }}
                />
                <p className="calendar-selected-date">
                    선택된 날짜: {calendarDate.toLocaleDateString()}
                </p>

                {dailyRecord ? (
                    <>
                        <div className="calendar-record">
                            <h4>📝 운동 기록</h4>
                            <p>총 볼륨: {dailyRecord["오늘 총 볼륨"]}</p>
                            <p>총 세트수: {dailyRecord["오늘 총 세트수"]}</p>
                            <p>운동 시작 시간: {dailyRecord["운동 시작 시간"]}</p>
                            <p>운동 종료 시간: {dailyRecord["운동 종료 시간"]}</p>
                            <p>오늘 루틴: {dailyRecord["오늘 한 루틴이름"]}</p>
                        </div>

                        {/* 💪 운동 상세 내역 */}
                        {dailyRecord["운동 목록"]?.length > 0 && (
                            <div className="calendar-record">
                                <h4>💪 세부 운동 내역</h4>
                                {dailyRecord["운동 목록"].map((exercise, idx) => (
                                    <div key={idx} className="exercise-log">
                                        <p><strong>{exercise["운동 이름"]}</strong></p>
                                        {exercise["세트"]?.map((set, sIdx) => (
                                            <p key={sIdx} className="set-log">
                                                세트 {sIdx + 1}: {set.reps}회 × {set.weight}kg
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="calendar-no-record">이 날에는 기록이 없습니다.</p>
                )}

            </div>
        </div>
    );
};

export default RoutineManage;

