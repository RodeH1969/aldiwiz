const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;
const DATA_FILE = path.join(__dirname, 'data', 'target.json');

app.use(express.json());
app.use(express.static(__dirname));

if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ target: 21, solutions: 76 }));

app.get('/api/target', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(DATA_FILE)));
});

app.post('/api/target', (req, res) => {
  const { target, password } = req.body;
  if (password !== (process.env.ADMIN_PASSWORD || 'aldi21admin')) return res.status(401).json({ error: 'Unauthorized' });
  if (!target || isNaN(target) || target <= 0) return res.status(400).json({ error: 'Invalid' });
  const existing = JSON.parse(fs.readFileSync(DATA_FILE));
  const data = { ...existing, target: parseFloat(target), date: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ ok: true, ...data });
});

app.get('/api/solutions', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json({ solutions: data.solutions || 76 });
});

app.post('/api/solutions', (req, res) => {
  const { solutions, password } = req.body;
  if (password !== (process.env.ADMIN_PASSWORD || 'aldi21admin')) return res.status(401).json({ error: 'Unauthorized' });
  if (isNaN(solutions) || solutions < 0) return res.status(400).json({ error: 'Invalid' });
  const existing = JSON.parse(fs.readFileSync(DATA_FILE));
  const data = { ...existing, solutions: parseInt(solutions) };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ ok: true, ...data });
});

app.get('/api/winner', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json({ winner: data.winner || null });
});

app.post('/api/winner', (req, res) => {
  const { winner, password } = req.body;
  if (password !== (process.env.ADMIN_PASSWORD || 'aldi21admin')) return res.status(401).json({ error: 'Unauthorized' });
  const existing = JSON.parse(fs.readFileSync(DATA_FILE));
  const data = { ...existing, winner: winner ? String(winner).trim() : null };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ ok: true, winner: data.winner });
});

app.listen(PORT, () => console.log('ALDIQ on port ' + PORT));