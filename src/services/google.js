const axios = require('axios');

const google = {

  getGoogleToken: async (googleCode) => {
    const endpoint = 'https://www.googleapis.com/oauth2/v4/token';

    const params = {
      code: googleCode,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI
    };

    const data = await axios.post(endpoint, params).then(response => response.data);

    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }

    return data.access_token;
  },

  getGoogleUser: async (googleToken) => {
    const endpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';

    const data = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${googleToken}`
      }
    }).then(response => response.data);

    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }
    return data;
  }

};

module.exports = {google};