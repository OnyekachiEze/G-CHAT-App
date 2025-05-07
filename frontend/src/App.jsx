import React from 'react'
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './Pages/HomePage.jsx';
import SignUpPage from './Pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './Pages/NotificationPage.jsx';
import CallPage from './Pages/CallPage.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import OnBoardingPage from './Pages/OnBoardingPage.jsx';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';




const App = () => {
  //TAN SLACK
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data
    },
    retry: false, // auth check
  });

  const authUser = authData?.user

  return (
    <div className='h-screen data-theme="night'>

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/notification' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path='/call' element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path='/onboarding' element={authUser ? <OnBoardingPage /> : <Navigate to="/login" />} />

      </Routes>

      <Toaster />

    </div>
  )
}

export default App