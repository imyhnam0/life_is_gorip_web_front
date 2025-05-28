
// let lastRequestTime = 0;
// const MIN_INTERVAL = 3000; // 최소 3초 간격

// const sendToGemini = async (userInput) => {
//   const now = Date.now();
//   if (now - lastRequestTime < MIN_INTERVAL) {
//     console.warn("요청이 너무 자주 발생합니다. 잠시 기다려 주세요.");
//     return "요청이 너무 자주 발생했습니다. 잠시 후 다시 시도해주세요.";
//   }
//   lastRequestTime = now;

//   //const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;

//   const body = {
//     contents: [
//       {
//         role: "user",
//         parts: [
//           { text: `다음 음식과 그람수의 열량, 탄수화물, 단백질, 지방을 알려줘:\n${userInput}` }
//         ]
//       }
//     ]
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body)
//     });

//     if (response.status === 429) {
//       console.error("429 Too Many Requests - 너무 많은 요청");
//       return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
//     }

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const json = await response.json();
//     return json.candidates?.[0]?.content?.parts?.[0]?.text || "응답 없음";

//   } catch (error) {
//     console.error("요청 중 오류 발생:", error);
//     return "오류 발생: " + error.message;
//   }
// };

//export default sendToGemini;
