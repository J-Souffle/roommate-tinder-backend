const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  price: { type: String, required: true }, // e.g., "$1,800/month"
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  city: { type: String, required: true },
  housing_type: { type: String, required: true }, // e.g., "Townhouse"
  apartment_name: { type: String, required: true },
  source: { type: String, required: true },
  address: { type: String, required: true },
  source_link: { type: String, required: true }
});

module.exports = mongoose.model('House', houseSchema);
