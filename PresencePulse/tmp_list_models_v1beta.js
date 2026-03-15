const axios = require('axios');
const GEMINI_API_KEY = 'AIzaSyAdiEhwar4UgBOdV1zRVt5PyqKG4gEclfw';

async function listModelsBeta() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
        const response = await axios.get(url);
        console.log('Available Models (v1beta):');
        response.data.models.forEach(m => console.log(m.name));
    } catch (error) {
        console.error('Error fetching v1beta models:', error.response ? error.response.data : error.message);
    }
}

listModelsBeta();
