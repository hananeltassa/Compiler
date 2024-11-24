// src/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher; // Required for compatibility with Laravel Echo

const echo = new Echo({
  broadcaster: 'reverb', // Correct broadcaster for Reverb
  key: process.env.REACT_APP_REVERB_APP_KEY || 'vbiph9e43w8txej7uvfz', // Use your Reverb app key
  wsHost: 'localhost', // Host for your Reverb server
  wsPort: 8080,        // Port for your Reverb server
  forceTLS: false,     // Set to false because Reverb uses HTTP in local setup
  disableStats: true,  // Optional: Disable stats collection
});

export default echo;
