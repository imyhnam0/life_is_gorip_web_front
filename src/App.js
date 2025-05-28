import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import FoodManage from './components/FoodManage';
import RoutineManage from './components/RoutineManage';
import Memopage from './components/Memopage';





function App() {  
  
   return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* 회원가입 */}
          <Route path="/login" element={<Login />} /> {/* 로그인 */}
          <Route path="/Homepage" element={<Homepage />} /> {/* 메인 페이지 */}
          <Route path="/FoodManage" element={<FoodManage />} /> {/* 식단 관리 페이지 */}
          <Route path="/RoutineManage" element={<RoutineManage />} /> {/* 루틴 관리 페이지 */}
          <Route path="/Memopage" element={<Memopage />} /> {/* 메모 페이지 */}
        </Routes>
      </BrowserRouter>
    </div>
   
  );
  
}

export default App;