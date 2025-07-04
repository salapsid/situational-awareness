import express from 'express';
import * as store from '../database/items_store.js';

const router = express.Router();

// Get all items
router.get('/items', (req, res) => {
  try {
    const items = store.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Get a single item by id
router.get('/items/:id', (req, res) => {
  try {
    const item = store.get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Create new item
router.post('/items', (req, res) => {
  const { id, name } = req.body || {};
  if (!id || !name) {
    return res.status(400).json({ error: 'Missing id or name' });
  }
  try {
    if (store.get(id)) {
      return res.status(409).json({ error: 'Item already exists' });
    }
    const created = store.add({ id, name });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Update item
router.put('/items/:id', (req, res) => {
  const { name } = req.body || {};
  try {
    const updated = store.update(req.params.id, { name });
    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Delete item
router.delete('/items/:id', (req, res) => {
  try {
    const removed = store.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
