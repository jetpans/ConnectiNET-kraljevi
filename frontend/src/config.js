let API_URL = '';

if (process.env.NODE_ENV === 'production') {
  API_URL = require('./config.prod').default;
} else {
  API_URL = require('./config.dev').default;
}

export default API_URL;
