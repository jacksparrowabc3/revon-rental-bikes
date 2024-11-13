const fs = require('fs');
const path = require('path');

// Path to your availability data file
const availabilityFile = path.join(__dirname, '..', 'availability.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    // Read and return availability data
    fs.readFile(availabilityFile, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error reading availability data' });
        return;
      }
      res.status(200).json(JSON.parse(data));
    });
  } else if (req.method === 'POST') {
    // Update availability data (admin functionality)
    const { bikeName, available } = req.body;

    fs.readFile(availabilityFile, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error reading availability data' });
        return;
      }

      const availabilityData = JSON.parse(data);
      availabilityData[bikeName] = available;

      fs.writeFile(availabilityFile, JSON.stringify(availabilityData), 'utf8', (err) => {
        if (err) {
          res.status(500).json({ error: 'Error saving availability data' });
          return;
        }
        res.status(200).json({ message: 'Availability updated' });
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
