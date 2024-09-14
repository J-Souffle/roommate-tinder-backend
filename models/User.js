const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pets: { type: String },
  occupation: { type: String },
  rentPriceRange: { type: String },
  smoker: { type: Boolean },
  socialLife: { type: String },
  sleepSchedule: { type: String },
  areaPreference: { type: String },
  moveInDate: { type: Date },
  houseType: { type: String },
  leaseDuration: { type: String },
  cleanlinessLevel: { type: String },
  workSchedule: { type: String },
  favoriteHomes: { type: [String] } // Array of home IDs or similar
});

module.exports = mongoose.model('User', userSchema);
