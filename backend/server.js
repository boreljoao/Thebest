const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const inventoryFile = path.join(dataDir, 'inventory.json');
const ordersFile = path.join(dataDir, 'order.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secret';

function readJson(file, fallback) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    if (!content.trim()) return fallback;
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data));
}

// Inventory endpoints
app.get('/inventory', (req, res) => {
  const inv = readJson(inventoryFile, { available: 0 });
  res.json(inv);
});

app.post('/inventory', (req, res) => {
  if (req.headers['authorization'] !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const body = req.body || {};
  const inv = readJson(inventoryFile, { available: 0 });
  if (body.decrement && inv.available > 0) {
    inv.available -= 1;
  }
  if (typeof body.set === 'number') {
    inv.available = body.set;
  }
  writeJson(inventoryFile, inv);
  res.json(inv);
});

// Orders endpoints
app.get('/orders', (req, res) => {
  if (req.headers['authorization'] !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const orders = readJson(ordersFile, []);
  res.json(orders);
});

app.post('/orders', (req, res) => {
  const body = req.body || {};
  if (body.limpar) {
    if (req.headers['authorization'] !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    writeJson(ordersFile, []);
    return res.json({ success: true });
  }
  const orders = readJson(ordersFile, []);
  const now = new Date().toISOString();
  const quantidade = body.quantidade || 1;
  orders.push({ id: Date.now(), ...body, quantidade, hora: now });
  writeJson(ordersFile, orders);
  const inv = readJson(inventoryFile, { available: 0 });
  if (inv.available > 0) {
    inv.available -= quantidade;
    writeJson(inventoryFile, inv);
  }
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
