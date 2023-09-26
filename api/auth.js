const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('Method not allowed');
        }

        const { code } = req.body;

        if (!code) {
            throw new Error('No authorization code provided');
        }

        // Exchange the code for an access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.DISCORD_REDIRECT_URI,
                scope: 'identify'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange authorization code for token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch user info using the access token
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user info');
        }

        const userData = await userResponse.json();

        res.status(200).json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
