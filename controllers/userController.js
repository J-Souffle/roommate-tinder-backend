exports.getUserProfile = (req, res) => {
    // Mock user profile
    res.json({ user: { name: 'John Doe', email: 'john.doe@example.com' } });
  };
  