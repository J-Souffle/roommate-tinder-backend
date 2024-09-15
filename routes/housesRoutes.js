const express = require('express');
const router = express.Router();
const House = require('../models/House');

// Fetch houses based on user preferences
router.get('/search', async (req, res) => {
  const { city, priceRange } = req.query;

  // Basic validation
  if (!city || !priceRange) {
    return res.status(400).json({ msg: 'City and price range are required' });
  }

  try {
    // Fetch houses based on city and price range
    const houses = await House.find({
      city: city,
      price: { $lte: priceRange } // Assuming priceRange is a maximum price, adjust as necessary
    });

    if (houses.length === 0) {
      return res.status(404).json({ msg: 'No houses found' });
    }

    res.json(houses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
