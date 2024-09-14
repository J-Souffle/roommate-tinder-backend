const { fetchProtectedData } = require('../utils/apiService'); // or '../services/apiService'

const getProtectedData = async (req, res) => {
  try {
    const data = await fetchProtectedData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
