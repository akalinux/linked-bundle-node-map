const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the 'build' directory (or 'dist')
app.use(express.static(path.join(__dirname, '..','public'))); // Adjust 'build' as per your SPA framework

// For any other route, serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'loopback.html')); // Adjust 'build' as per your SPA framework
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
