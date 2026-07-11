const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/user-profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Token verified. Welcome!',
    user: req.user
  });
});

module.exports = router;
