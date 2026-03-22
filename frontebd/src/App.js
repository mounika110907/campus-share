import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddResource from './pages/AddResource';
import MyResources from './pages/MyResources';
import BorrowRequests from './pages/BorrowRequests';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/add-resource"
        element={
          <PrivateRoute>
            <AddResource />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-resources"
        element={
          <PrivateRoute>
            <MyResources />
          </PrivateRoute>
        }
      />

      <Route
        path="/borrow-requests"
        element={
          <PrivateRoute>
            <BorrowRequests />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;