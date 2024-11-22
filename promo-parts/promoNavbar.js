import React from 'react'
import {Row,Col} from 'react-bootstrap'
import './promoNavbar.css'
import Model from 'react-modal'
import { useState } from 'react'
import { FaRegCircleXmark } from "react-icons/fa6";
import { Navigate, useNavigate } from 'react-router-dom'

import axios from 'axios'

const PromoNavbar = () => {
  const [visible,setVisible] = useState(false)
  const [login,setLogin] = useState(false)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3000/api/v1/artists/', {
            name: username,
            email: email,
            password: password
        });
        alert('Sign-up successful');
        console.log(response.data);

        // Assuming the token is in response.data.token
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            navigate('/profile')
        } else {
            console.error('No token in response');
        }
    } catch (error) {
        console.error('Error during sign-up:', error);
    }
};


const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3000/api/v1/artists/login', {
            email: email,
            password: password 
        });
        alert('Login Successful');
        // Assuming the token is in response.data.token, adjust if necessary
        navigate('/profile')
        localStorage.setItem('authToken', response.data.token); 
        console.log("Logged in and token stored:", response.data.token);
    } catch (error) {
        console.error("Error during log-in:", error);
    }
};

  return (

    <div>
      <Row className='rowBG'>
          <Col sm={6} md={6} lg={6} className='colBG'>
          <h1 className='title'> ArtVerse.</h1>
          </Col>
          <Col sm={6} md={6} lg={6} className='colBG2'>
          <div class="button-containernav1">
          <button className='auth-button1' onClick={() => { setVisible(true); setLogin(false); }}>Sign up</button>
          <button className='auth-button1' onClick={() => { setVisible(true); setLogin(true); }}>Log in</button>
</div>
<Model isOpen={visible} className="modelProperties">
        <a href="#" onClick={() => setVisible(false)}>
          <FaRegCircleXmark className="XIcon" />
        </a>
        
        <h1 className="ArtVerse">{login ? 'Hop back into the ArtVerse!' : 'Join the ArtVerse!'}</h1>

        <div className="card">
          <h2>{login ? 'Log In' : 'Sign Up'}</h2>

          <form onSubmit={login ? handleLogin : handleSignUp}>
            {login ? null : (
              <>
                <label htmlFor="name">Username</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </>
            )}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">{login ? 'Log In' : 'Sign Up'}</button>
          </form>
        </div>
      </Model>
      </Col>
      </Row>
    </div>
  );
};

export default PromoNavbar;