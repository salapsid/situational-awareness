import fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, 'items_data.json');

let items = [];

function loadItems() {
  try {
    const txt = fs.readFileSync(DATA_PATH, 'utf-8');
    items = JSON.parse(txt);
  } catch {
    items = [];
  }
}

function saveItems() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));
}

export function getAll() {
  return items;
}

export function get(id) {
  return items.find(it => String(it.id) === String(id));
}

export function add(item) {
  items.push(item);
  saveItems();
  return item;
}

export function update(id, fields) {
  const idx = items.findIndex(it => String(it.id) === String(id));
  if (idx === -1) return null;
  items[idx] = {...items[idx], ...fields};
  saveItems();
  return items[idx];
}

export function remove(id) {
  const idx = items.findIndex(it => String(it.id) === String(id));
  if (idx === -1) return null;
  const [deleted] = items.splice(idx, 1);
  saveItems();
  return deleted;
}

loadItems();
