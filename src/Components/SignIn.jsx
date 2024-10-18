import React, { useEffect, useState } from 'react';
import '../styles/signin.css'
import { useNavigate } from 'react-router-dom';


const SignIn = ({ onSignIn,isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    if(isLoggedIn){
      navigate("/");
    }
  })
  const handleSignIn = () => {
    // In a real application, we would validate the credentials on the server
    // For simplicity, let's use a predefined set of credentials
    const validUsername = 'admin';
    const validPassword = 'admin@123';

    if (username === validUsername && password === validPassword) {
      // Authentication successful
      localStorage.setItem('user', username);
      onSignIn(username); // Notify the parent component about the successful login
    } else {
      // Authentication failed
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <div className="left-section">
        <h1 className="chatbot-header">Query Crafters AI</h1>
        <p className="chatbot-description">
          Welcome to Query Crafters AI! This chatbot converts natural language queries
           into MongoDB queries and extracts data for you. Please login to explore.
        </p>
      </div>
      
      <div className="right-section">
        <div className="login-modal">
      <img src='ai.png'></img>

        {/* <h1>Login here</h1> */}
          <form>
        <div className='form-group'> 
        <label for="email">Username:</label>
        <input className="form-control formstyle" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Type here your username...'/><br/><br/>
      </div>
      <div className='form-group'>
        <label for="password">Password</label>
        <input className="form-control formstyle" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Your password...'/><br/><br/>
      </div></form>
      <button className="signin_btn" onClick={handleSignIn}>Sign In</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
    </div>
    </div>
    
  );
};

export default SignIn;