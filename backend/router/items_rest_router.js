import express from 'express';

const router = express.Router();

// In-memory items storage
let items = [];

// Get all items
router.get('/items', (req, res) => {
  res.json(items);
});

// Get a single item by id
router.get('/items/:id', (req, res) => {
  const item = items.find(i => String(i.id) === String(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    res.json(item);
  }
});

// Create new item
router.post('/items', (req, res) => {
  const { id, name } = req.body || {};
  if (id === undefined || name === undefined) {
    return res.status(400).json({ error: 'Missing id or name' });
  }
  const existing = items.find(i => String(i.id) === String(id));
  if (existing) {
    return res.status(409).json({ error: 'Item already exists' });
  }
  const newItem = { id, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update item
router.put('/items/:id', (req, res) => {
  const { name } = req.body || {};
  const idx = items.findIndex(i => String(i.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  if (name !== undefined) {
    items[idx].name = name;
  }
  res.json(items[idx]);
});

// Delete item
router.delete('/items/:id', (req, res) => {
  const idx = items.findIndex(i => String(i.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const removed = items.splice(idx, 1)[0];
  res.json(removed);
});

export default router;
