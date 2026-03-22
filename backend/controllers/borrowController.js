const BorrowRequest = require('../models/BorrowRequest');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');

const normalizeDate = (value) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getTodayWithoutTime = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

exports.createBorrowRequest = async (req, res) => {
  try {
    const { resourceId, startDate, endDate } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!resource.availability) {
      return res.status(400).json({ message: 'Resource is not available' });
    }

    if (resource.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot borrow your own resource' });
    }

    const today = getTodayWithoutTime();
    const parsedStartDate = normalizeDate(startDate);
    const parsedEndDate = normalizeDate(endDate);

    if (parsedStartDate < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (parsedEndDate < today) {
      return res.status(400).json({ message: 'End date cannot be in the past' });
    }

    if (parsedEndDate < parsedStartDate) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    const maxEndDate = new Date(parsedStartDate);
    maxEndDate.setMonth(maxEndDate.getMonth() + 3);

    if (parsedEndDate > maxEndDate) {
      return res.status(400).json({ message: 'Cannot borrow for more than 3 months' });
    }

    const request = await BorrowRequest.create({
      resource: resource._id,
      owner: resource.owner,
      borrower: req.user.id,
      startDate: parsedStartDate,
      endDate: parsedEndDate
    });

    await Notification.create({
      user: resource.owner,
      message: `New borrow request for ${resource.title}`
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ owner: req.user.id })
      .populate('resource')
      .populate('borrower', 'name department year');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBorrowedRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ borrower: req.user.id })
      .populate('resource')
      .populate('owner', 'name department');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBorrowStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await BorrowRequest.findById(req.params.id).populate('resource');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      await Resource.findByIdAndUpdate(request.resource._id, { availability: false });
    }

    if (status === 'returned') {
      await Resource.findByIdAndUpdate(request.resource._id, { availability: true });
    }

    await Notification.create({
      user: request.borrower,
      message: `Your request for ${request.resource.title} was ${status}`
    });

    res.json({
      message: `Request ${status} successfully`,
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};