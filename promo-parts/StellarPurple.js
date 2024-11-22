import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './StellarPurple.css';
import { generateStars } from '../utils/generateStars';
import { generateWhiteStars } from '../utils/generateWhiteStars';
import Carousel from 'react-bootstrap/Carousel'; // Use react-bootstrap Carousel

// Updated path for images directly from the public folder
const slides = [
  { imgSrc: '/images/GroupPhoto1.jpg' },
  { imgSrc: '/images/GroupPhoto2.jpg' },
  { imgSrc: '/images/GroupPhoto3.jpg' },
  { imgSrc: '/images/GroupPhoto4.jpg' },
  { imgSrc: '/images/GroupPhoto5.jpg' },
  { imgSrc: '/images/GroupPhoto6.jpg' },
  { imgSrc: '/images/GroupPhoto7.jpg' },
];

const StellarPurple = () => {
  return (
    <div>
      <Row>
        <Col sm={6} md={6} lg={6} className="PaddingFix">
          <div className="backgroundL2">
            <Carousel interval={5000} controls={true} indicators={true}>
              {slides.map((slide, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={slide.imgSrc}
                    alt={`Slide ${index + 1}`}
                    className="d-block w-100"
                    style={{
                      maxHeight: '35rem',
                      maxWidth: '30rem',
                      margin:'auto', // Centers horizontally
                      alignItems: 'center',     // Centers vertically
                      objectFit: 'cover',       // Ensures the image fills the container
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            {generateStars(50)}
            {generateWhiteStars(70)}
          </div>
        </Col>
        <Col sm={6} md={6} lg={6} className="PaddingFix">
          <div className="backgroundR2">
            <p className="header">Connect with Like-Minded Artists</p>
            <p className="text">
              <strong>
                ArtVerse is more than just a platform—it's a community. Join groups of artists who share your passions and interests. Collaborate on projects, exchange ideas, and find your artistic tribe. Whether you're into digital art, painting, or sculpture, there's a space here for you.
              </strong>
            </p>
            {generateStars(50)}
            {generateWhiteStars(70)}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StellarPurple;
