// src/echo.js
import Echo from "laravel-echo";

const echo = new Echo({
  broadcaster: "pusher",
  key: "d147720fc37b1e8976ee",
  cluster: "ap2",
  forceTLS: true,
});

echo.channel(`file.${currentFile}`).listen("FileUpdated", (event) => {
  console.log("File updated:", event);
});
