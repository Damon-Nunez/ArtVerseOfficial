export function generateWhiteStars(numStars) {
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const starStyle = {
      position: 'absolute',
      width: `${Math.random() * 2 + 1}px`, // Random size between 1px and 3px
      height: `${Math.random() * 2 + 1}px`,
      background: 'white',
      borderRadius: '50%',
      opacity: Math.random() * 0.5 + 0.5, // Random opacity between 0.5 and 1
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `twinkle ${Math.random() * 1 + 1}s infinite ease-in-out alternate, drift ${Math.random() * 2 + 3}s linear infinite`
    };

    stars.push(<div className="star" key={i} style={starStyle}></div>);
  }
  return stars;
}
