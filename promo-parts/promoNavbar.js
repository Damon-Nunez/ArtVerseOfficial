import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaRegCircleXmark } from "react-icons/fa6";
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import axios from 'axios';
import './promoNavbar.css';

Modal.setAppElement('#__next'); // Use your app's root element (e.g., '#root' or '#__next' for Next.js)

const PromoNavbar = () => {
  const [visible, setVisible] = useState(false);
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const router = useRouter(); // Initialize the router

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:3000/api/artists/addArtist', {
        name: username,
        email: email,
        password: password,
      });

      if (response.status === 201 && response.data?.message) {
        alert(response.data.message);
        router.push('/profile'); 
      } else {
        setErrorMessage('Sign-up failed. Please try again.'); // Default error message
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || 'An error occurred during sign-up.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email: email,
        password: password,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        router.push('/profile'); 
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Invalid email or password.');
      } else {
        setErrorMessage('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div>
      <Row className='rowBG'>
        <Col sm={6} md={6} lg={6} className='colBG'>
          <h1 className='title'>ArtVerse.</h1>
        </Col>
        <Col sm={6} md={6} lg={6} className='colBG2'>
          <div className="button-containernav1">
            <button className='auth-button1' onClick={() => { setVisible(true); setLogin(false); }}>Sign up</button>
            <button className='auth-button1' onClick={() => { setVisible(true); setLogin(true); }}>Log in</button>
          </div>
          <Modal isOpen={visible} className="modelProperties">
            <a href="#" onClick={() => setVisible(false)}>
              <FaRegCircleXmark className="XIcon" />
            </a>
            <h1 className="ArtVerse">{login ? 'Hop back into the ArtVerse!' : 'Join the ArtVerse!'}</h1>

            <div className="card">
              <h2>{login ? 'Log In' : 'Sign Up'}</h2>

              {/* Display Error Message */}
              {errorMessage && (
                <p
                  style={{
                    color: 'red',
                    fontSize: '14px',
                    marginTop: '10px',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    border: '1px solid #ffcccc',
                    borderRadius: '5px',
                  }}
                >
                  {errorMessage}
                </p>
              )}

              <form onSubmit={login ? handleLogin : handleSignUp}>
                {!login && (
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
                  style={{ marginBottom: '30px' }} 
                />

                <button type="submit">{login ? 'Log In' : 'Sign Up'}</button>
              </form>
            </div>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default PromoNavbar;
