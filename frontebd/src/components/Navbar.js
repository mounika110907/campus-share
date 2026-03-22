import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>Smart Campus Share</h2>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-resource">Add Resource</Link>
        <Link to="/my-resources">My Resources</Link>
        <Link to="/borrow-requests">Requests</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/profile">Profile</Link>
        {user && <span className="welcome">Hi, {user.name}</span>}
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;