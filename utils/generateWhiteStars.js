import seedrandom from 'seedrandom';

export function generateWhiteStars(numStars, seed = 'defaultSeed') {
  const rng = seedrandom(seed); // Create a seeded RNG based on a seed value
  const stars = [];
  
  for (let i = 0; i < numStars; i++) {
    const starStyle = {
      position: 'absolute',
      width: `${rng() * 2 + 1}px`, // Random size between 1px and 3px
      height: `${rng() * 2 + 1}px`,
      background: 'white',
      borderRadius: '50%',
      opacity: rng() * 0.5 + 0.5, // Random opacity between 0.5 and 1
      top: `${rng() * 100}%`,
      left: `${rng() * 100}%`,
      animation: `twinkle ${rng() * 1 + 1}s infinite ease-in-out alternate, drift ${rng() * 2 + 3}s linear infinite`
    };

    stars.push(<div className="star" key={`star-${i}`} style={starStyle}></div>);
  }

  return stars;
}
