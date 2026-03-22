const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text || !text.trim()) {
      return res.status(400).json({ message: 'Receiver and message are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'Invalid receiver ID' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'You cannot message yourself' });
    }

    const receiverUser = await User.findById(receiverId);
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver user not found' });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      text: text.trim()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};