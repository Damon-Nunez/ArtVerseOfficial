export const generateWhiteStars = (numStars) => {
    return [...Array(numStars)].map((_, i) => {
        const size = Math.random() * 3 + 1; // Random star size between 1px and 4px
        const animationDuration = Math.random() * 3 + 1; // Random animation duration between 1s and 4s
        return (
            <div
                className="star"
                key={i}
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: 'white', // All stars are white
                    animationDuration: `${animationDuration}s`,
                    animationDelay: `${Math.random() * 5}s`,
                }}
            ></div>
        );
    });
};
