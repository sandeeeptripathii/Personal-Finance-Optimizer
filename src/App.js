import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Survey from './components/Survey';
import ThankYou from './components/ThankYou';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/survey" element={
          <PrivateRoute>
            <Survey />
          </PrivateRoute>
        } />
        <Route path="/thank-you" element={
          <PrivateRoute>
            <ThankYou />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;