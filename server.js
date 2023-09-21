const express = require('express');
const app = express();
const path = require('path');

// Serve static files (including service-worker.js) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve your React app here
// Example: app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

