const express = require('express');
const mongoose = require('mongoose');
const Claim = require('../models/Claim');
const Item = require('../models/Item');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json(claims.map((c) => ({
      id: c._id,
      itemId: String(c.itemId),
      claimantId: String(c.claimantId),
      details: c.details,
      status: c.status,
    })));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload || !payload.itemId || !payload.claimantId || !payload.details) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(payload.itemId)) {
      return res.status(400).json({ message: 'Invalid itemId' });
    }
    if (!mongoose.Types.ObjectId.isValid(payload.claimantId)) {
      return res.status(400).json({ message: 'Invalid claimantId' });
    }
    const created = await Claim.create({
      itemId: new mongoose.Types.ObjectId(payload.itemId),
      claimantId: new mongoose.Types.ObjectId(payload.claimantId),
      details: payload.details,
      status: 'pending',
    });
    res.status(201).json({ id: created._id });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

// Update claim status: pending -> accepted/rejected
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await Claim.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Claim not found' });
    // If accepted, mark the related item as matched
    if (status === 'accepted') {
      await Item.findByIdAndUpdate(updated.itemId, { status: 'matched' });
    }
    res.json({ id: updated._id, status: updated.status });
  } catch (err) {
    next(err);
  }
});

// POST alias for environments that block PATCH
router.post('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await Claim.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Claim not found' });
    if (status === 'accepted') {
      await Item.findByIdAndUpdate(updated.itemId, { status: 'matched' });
    }
    res.json({ id: updated._id, status: updated.status });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


