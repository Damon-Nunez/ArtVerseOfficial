export const generateStars = (numStars) => {
    const starColors = ['white', '#ff00c8', '#00c6ff', '#e4d9ff']; // Diverse star colors
    return [...Array(numStars)].map((_, i) => {
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        return (
            <div
                className="star"
                key={i}
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    background: color, // Assign random color
                }}
            ></div>
        );
    });
};