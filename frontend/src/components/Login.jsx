import { useState } from 'react';
import { mockValidateUser, useMockApi } from '../utils/mockApi';
import './Login.css';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const shouldUseMockApi = useMockApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim() || !dob) {
      setError('Please enter both name and date of birth');
      setLoading(false);
      return;
    }

    try {
      let data;
      
      // Use mock API if in development mode
      if (shouldUseMockApi) {
        data = await mockValidateUser(name.trim(), dob);
      } else {
        // Call Google Apps Script API
        const response = await fetch(
          import.meta.env.VITE_APPS_SCRIPT_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'validateUser',
              name: name.trim(),
              dob: dob,
            }),
          }
        );

        data = await response.json();
      }

      if (data.success) {
        if (data.alreadyPicked) {
          setError('You have already picked your Secret Santa!');
        } else {
          onLogin({ name: name.trim(), dob, userId: data.userId });
        }
      } else {
        setError(data.message || 'Invalid credentials. Please check your name and date of birth.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎅 Secret Santa 🎄</h1>
          <p>Enter your details to pick your Secret Santa</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={loading}
              autoComplete="bday"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Continue to Pick'}
          </button>
        </form>
      </div>
      <div className="snowflakes" aria-hidden="true">
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
      </div>
    </div>
  );
};

export default Login;
