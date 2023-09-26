const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send({ status: 'ERROR', error: 'No Code Provided' });
  }

  const params = new URLSearchParams();
  params.set('client_id', process.env.DISCORD_CLIENT_ID);
  params.set('client_secret', process.env.DISCORD_CLIENT_SECRET);
  params.set('grant_type', 'authorization_code');
  params.set('code', code);
  params.set('redirect_uri', process.env.DISCORD_REDIRECT_URI);

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();

  if (json.access_token) {
    // Use this token to fetch user information, guilds, etc.
    // Here, we are just sending it back for simplification.
    res.status(200).send({ status: 'SUCCESS', token: json.access_token });
  } else {
    res.status(400).send({ status: 'ERROR', error: json.error });
  }
};
