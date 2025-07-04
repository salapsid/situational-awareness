import express from 'express';
import Item from '../database/items_schema.js';

const router = express.Router();

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Get a single item by id
router.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Create new item
router.post('/items', async (req, res) => {
  const { id, name } = req.body || {};
  if (id === undefined || name === undefined) {
    return res.status(400).json({ error: 'Missing id or name' });
  }
  try {
    const created = await Item.create({ id, name });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Item already exists' });
    }
    res.status(500).json({ error: String(err) });
  }
});

// Update item
router.put('/items/:id', async (req, res) => {
  const { name } = req.body || {};
  try {
    const updated = await Item.findOneAndUpdate(
      { id: req.params.id },
      { name },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const removed = await Item.findOneAndDelete({ id: req.params.id });
    if (!removed) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
