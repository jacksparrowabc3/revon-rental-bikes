const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for front-end requests
app.use(cors());
app.use(express.json()); // For parsing JSON data in requests

// Serve static files (HTML, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Path to availability data (we'll use JSON to store availability)
const availabilityFile = path.join(__dirname, 'availability.json');

// Get bike availability
app.get('/api/availability', (req, res) => {
  fs.readFile(availabilityFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading availability data');
      return;
    }
    res.json(JSON.parse(data)); // Send availability data as JSON
  });
});

// Admin route to update bike availability
app.post('/api/availability', (req, res) => {
  const newAvailability = req.body; // Expected { bikeName: 'bikeName', available: true/false }

  fs.readFile(availabilityFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading availability data');
      return;
    }

    const availabilityData = JSON.parse(data);
    availabilityData[newAvailability.bikeName] = newAvailability.available;

    fs.writeFile(availabilityFile, JSON.stringify(availabilityData), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Error saving availability data');
        return;
      }
      res.status(200).send('Availability updated');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
