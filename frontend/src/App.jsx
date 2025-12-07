
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* A small helper route for OAuth success redirection */}
        <Route path="/oauth-success" element={<OauthSuccessHandler />} />
      </Routes>
    </BrowserRouter>
  );
}

// Simple component reads token from query and saves it
function OauthSuccessHandler() {
  // we use useSearchParams from react-router either here or small vanilla code
  // to keep it short I use window.location
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('token', token);
    window.location.href = '/dashboard';
    return null;
  } else {
    window.location.href = '/login';
    return null;
  }
}

