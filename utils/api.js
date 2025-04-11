import axios from "axios";

export const fetchProfileData = async (artistId = null) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');

        const endpoint = artistId 
            ? `/api/artists/getArtistProfile?id=${artistId}`  // Corrected to use the artistId in the URL
            : '/api/artists/getArtistProfile';              // No ID, fetch the current user's profile

        const response = await axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching profile data:', error.response?.data || error.message);
        return null;
    }
};
