import React from 'react'
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './Pages/HomePage.jsx';
import SignUpPage from './Pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './Pages/NotificationPage.jsx';
import CallPage from './Pages/CallPage.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import OnBoardingPage from './Pages/OnBoardingPage.jsx';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';




const App = () => {
  //TAN SLACK
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className='h-screen' data-theme="night" >

      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />

        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />

        <Route path='/notification' element={isAuthenticated ? <NotificationPage /> : <Navigate to="/login" />} />

        <Route path='/call' element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path='/chat' element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />

        <Route path='/onboarding' element={isAuthenticated ? <OnBoardingPage /> : <Navigate to="/login" />} />

      </Routes>

      <Toaster />

    </div>
  )
}

export default App