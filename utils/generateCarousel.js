import Carousel from 'react-bootstrap/Carousel';
import './generateCarousel.css';

function GenerateCarousel({ children }) {
  return (
    <Carousel interval={5000} nextLabel="Next" prevLabel="Prev" data-bs-theme="dark">
      {Array.isArray(children) && children.length > 0 ? (
        children.map((child, index) => (
          <Carousel.Item key={index}>
            {child.imgSrc && (
              <img
                className="d-block w-100 carousel-img"
                src={child.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            )}
            {child.caption && (
              <Carousel.Caption>
                {/* Add caption content if available */}
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))
      ) : (
        <p>No slides available</p> // Add fallback message or empty state
      )}
    </Carousel>
  );
}

export default GenerateCarousel;
