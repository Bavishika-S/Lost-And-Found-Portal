const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items.map((i) => ({
      id: i._id,
      name: i.name,
      category: i.category,
      description: i.description,
      location: i.location,
      date: i.date,
      contactDetails: i.contactDetails,
      image: i.image,
      userId: String(i.userId),
      status: i.status,
      type: i.type,
    })));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload || !payload.name || !payload.category || !payload.description || !payload.location || !payload.date || !payload.contactDetails || !payload.userId || !payload.type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }
    const created = await Item.create({
      name: payload.name,
      category: payload.category,
      description: payload.description,
      location: payload.location,
      date: payload.date,
      contactDetails: payload.contactDetails,
      image: payload.image,
      userId: new mongoose.Types.ObjectId(payload.userId),
      status: 'pending',
      type: payload.type,
    });
    res.status(201).json({ id: created._id });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

// Delete an item (and any related claims)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    await Claim.deleteMany({ itemId: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// POST alias for environments that block DELETE
router.post('/:id/delete', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    await Claim.deleteMany({ itemId: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


