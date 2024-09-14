const User = require('../models/User');

const getPotentialRoommates = async (userId) => {
  try {
    // Get the preferences of the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new Error('User not found');

    // Find other users
    const users = await User.find({ _id: { $ne: userId } });

    // Define a simple matching score function
    const calculateMatchScore = (user1, user2) => {
      let score = 0;
      if (user1.rentPriceRange === user2.rentPriceRange) score += 1;
      if (user1.smoker === user2.smoker) score += 1;
      if (user1.socialLife === user2.socialLife) score += 1;
      if (user1.sleepSchedule === user2.sleepSchedule) score += 1;
      // Add more checks for similarities later
      return score;
    };

    // Compare the current user's preferences with other users
    const potentialRoommates = users
      .map(user => ({
        user,
        score: calculateMatchScore(currentUser, user)
      }))
      .filter(({ score }) => score > 1) // Set a score requrement for matching
      .sort((a, b) => b.score - a.score) // Sort by match score
      .map(({ user }) => user);

    return potentialRoommates;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { getPotentialRoommates };
