import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import SignIn from './Components/SignIn';
import Script from './Components/Script';


function App() {
  // const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');

  const [isLoggedIn, setIsLoggedIn] = useState(storedUser?true:false);

  useEffect(() => {
    // Check if the user is already logged in from localStorage

  }, [isLoggedIn]);

  const handleSignIn = (username) => {
    // Set user data to localStorage and update the state
    localStorage.setItem('user', username);
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    // Clear user data from localStorage and update the state
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} isLoggedIn={isLoggedIn} />}>
          </Route>
          <Route path="/:id?" element={<Script onLogout={handleLogoutClick} isLoggedIn={isLoggedIn} />}>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
