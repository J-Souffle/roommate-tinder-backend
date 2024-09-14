const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  pets: String,
  occupation: String,
  rentPriceRange: String,
  smoker: Boolean,
  socialLife: String,
  sleepSchedule: String,
  areaPreference: String,
  moveInDate: Date,
  houseType: String,
  leaseDuration: String,
  cleanlinessLevel: String,
  workSchedule: String,
  favoriteHomes: [String] // Array of home IDs or similar
});

module.exports = mongoose.model('User', userSchema);
