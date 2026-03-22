const Resource = require('../models/Resource');

exports.addResource = async (req, res) => {
  try {
    const { title, description, category, condition, imageUrl } = req.body;

    const resource = await Resource.create({
      title,
      description,
      category,
      condition,
      imageUrl,
      owner: req.user.id
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate(
      'owner',
      'name department year reputation'
    );
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ owner: req.user.id });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};