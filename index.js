const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Path to the counter file
const counterFile = path.join(__dirname, 'counter.json');

// Initialize counter file if it doesn't exist
if (!fs.existsSync(counterFile)) {
  fs.writeFileSync(counterFile, JSON.stringify({ count: 0 }, null, 2));
}

// Middleware to parse JSON
app.use(express.json());

// Increment the counter
app.post('/api/increment', (req, res) => {
  fs.readFile(counterFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading counter file.');

    const counter = JSON.parse(data);
    counter.count += 1;

    fs.writeFile(counterFile, JSON.stringify(counter, null, 2), (err) => {
      if (err) return res.status(500).send('Error updating counter file.');
      res.status(200).send({ message: 'Counter incremented.', count: counter.count });
    });
  });
});

// Get the current counter
app.get('/api/counter', (req, res) => {
  fs.readFile(counterFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading counter file.');

    const counter = JSON.parse(data);
    res.status(200).send({ count: counter.count });
  });
});

app.get('/api/reset', (req, res) => {
  //reset the counter 
  fs.readFile(counterFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading counter file.');

    const counter = JSON.parse(data);
    counter.count = 0;

    fs.writeFile(counterFile, JSON.stringify(counter, null, 2), (err) => {
      if (err) return res.status(500).send('Error updating counter file.');
      res.status(200).send({ message: 'Counter incremented.', count: counter.count });
    });
  });
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
