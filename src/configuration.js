
const googleClientId = import.meta.env.VITE_GOGGLE_OAUTH_CLIENT_ID;


const googleConfig = {
  web: {
    client_id: googleClientId,
  },
};

export { googleConfig };
