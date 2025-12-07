// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';



export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  // on mount, fetch current user using token saved in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      nav('/login');
      return;
    }

    API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.user))
      .catch(() => {
        // if something broke, send user to login
        localStorage.removeItem('token');
        nav('/login');
      });
  }, []);

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>;

  function handleAsk(e) {
    e.preventDefault();
    if (!message.trim()) return alert('Please type something to ask.');
    // Placeholder: you could call ChatGPT API or another helper here.
    alert(`You asked: "${message}" — (this is a placeholder response)`);
    setMessage('');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    nav('/login');
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <h1>Welcome, {user.name || user.email} </h1>
      <p>How can I help you?</p>

      <form onSubmit={handleAsk} style={{ marginBottom: 16 }}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your request..."
          style={{ width: '80%', padding: 8, marginRight: 8 }}
        />
        <button type="submit">Ask</button>
      </form>

      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div>
        <strong>Account details</strong>
        <pre style={{ background: '#f5f5f5', padding: 12 }}>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}
