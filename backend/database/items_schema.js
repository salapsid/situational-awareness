import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true }
});

const Item = mongoose.model('item', itemSchema);

export default Item;
