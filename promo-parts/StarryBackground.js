import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './StarryBackground.css'; // Import your CSS file
import { generateStars } from '../utils/generateStars';
import { generateWhiteStars } from '../utils/generateWhiteStars';
import Carousel from 'react-bootstrap/Carousel'; // Ensure correct import from react-bootstrap
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Custom icons from react-icons

// Import all images from the public folder
import Img1 from '../public/images/TutCar1.jpg';
import Img2 from '../public/images/TutCar2.jpg';
import Img3 from '../public/images/TutCar3.jpg';
import Img4 from '../public/images/TutCar4.jpg';
import Img5 from '../public/images/TutCar5.jpg';
import Img6 from '../public/images/TutCar6.jpg';
import Img7 from '../public/images/TutCar7.jpg';
import Img8 from '../public/images/TutCar8.jpg';
import Img9 from '../public/images/TutCar9.jpg';

function StarryBackground() {
  const slides = [
    { imgSrc: Img1 },
    { imgSrc: Img2 },
    { imgSrc: Img3 },
    { imgSrc: Img4 },
    { imgSrc: Img5 },
    { imgSrc: Img6 },
    { imgSrc: Img7 },
    { imgSrc: Img8 },
    { imgSrc: Img9 },
  ];

  return (
    <Row>
      <Col sm={6} md={6} lg={6} className="PaddingFix">
        <div className="backgroundL">
          <p className="header">Unlock Your Creativity</p>
          <p className="text">
            <strong>
              Whether you're a seasoned artist or just starting out, ArtVerse offers a wealth of resources to help you grow.
              Discover tutorials, step-by-step guides, and interactive courses designed to enhance your skills OR share your own work and inspire others!
            </strong>
          </p>
          {generateStars(100)}
          {generateWhiteStars(130)}
        </div>
      </Col>
      <Col sm={6} md={6} lg={6} className="PaddingFix">
        <div className="backgroundR">
          <Carousel
            interval={5000}
            controls={true}
            indicators={true}
            nextLabel={<FaChevronRight className="carousel-arrow" />} // Add className for custom styling
            prevLabel={<FaChevronLeft className="carousel-arrow" />}  // Add className for custom styling
          >
            {slides.map((slide, index) => (
              <Carousel.Item key={index}>
                <Image
                  src={slide.imgSrc}
                  alt={`Slide ${index + 1}`}
                  layout="responsive"
                  width={800}
                  height={450}
                  style={{
                    maxHeight: '40rem',
                    maxWidth: '30rem',
                    margin:'auto', // Centers horizontally
                    alignItems: 'center',     // Centers vertically
                    objectFit: 'cover',       // Ensures the image fills the container
                  }}                />
              </Carousel.Item>
            ))}
          </Carousel>
          {generateStars(100)}
          {generateWhiteStars(130)}
        </div>
      </Col>
    </Row>
  );
}

export default StarryBackground;
