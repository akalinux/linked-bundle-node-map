import express from 'express';
import nocache from 'nocache';
import path from 'path';
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = import.meta.dirname;

app.use(nocache());
// Serve static files from the 'build' directory (or 'dist')
app.use(express.static(path.join(__dirname, '..','..','public'))); // Adjust 'build' as per your SPA framework

// For any other route, serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..','..','public', 'index.html')); // Adjust 'build' as per your SPA framework
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
