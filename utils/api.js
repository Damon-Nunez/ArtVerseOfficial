import axios from 'axios';

export const fetchProfileData = async () => {
    try {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:3000/api/artists/getArtistProfile', {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        return response.data; // Return the profile data if successful
    } catch (error) {
        console.error('Error fetching profile data:', error.response?.data || error.message);
        return null;
    }
};

// utils/api.js

  