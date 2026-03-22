const Rating = require('../models/Rating');
const User = require('../models/User');
const BorrowRequest = require('../models/BorrowRequest');

exports.addRating = async (req, res) => {
  try {
    const { toUser, borrowRequest, score, review } = req.body;

    const request = await BorrowRequest.findById(borrowRequest);
    if (!request || request.status !== 'returned') {
      return res.status(400).json({ message: 'Rating allowed only after return' });
    }

    const rating = await Rating.create({
      fromUser: req.user.id,
      toUser,
      borrowRequest,
      score,
      review
    });

    const ratings = await Rating.find({ toUser });
    const avg = ratings.reduce((sum, item) => sum + item.score, 0) / ratings.length;

    await User.findByIdAndUpdate(toUser, {
      reputation: Number(avg.toFixed(1))
    });

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};