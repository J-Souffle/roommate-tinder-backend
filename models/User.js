const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  budget: { type: Number },
  housePreference: { type: String },
  city: { type: String },
  state: { type: String },
  bio: { type: String },
  isSmokingOk: { type: String },
  arePetsOk: { type: String },
  sleepTime: { type: String },
  moveInDate: { type: Date },
  occupation: { type: String },
  profilePicture: { type: String }, // Field to store the URL/path of the profile picture
  favoriteHomes: { type: [String] }
});

module.exports = mongoose.model('User', userSchema);
