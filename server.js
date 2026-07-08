import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'orcamentos');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// List all budgets (metadata only — id, name, client, totals, dates)
app.get('/api/budgets', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const budgets = files.map(file => {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
      return {
        id: data.id,
        name: data.name,
        clientName: data.clientData?.name || '',
        total: data.total || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    budgets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar orçamentos' });
  }
});

// Get a specific budget
app.get('/api/budgets/:id', (req, res) => {
  try {
    const file = path.join(DATA_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(file)) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }
    res.json(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar orçamento' });
  }
});

// Create a new budget
app.post('/api/budgets', (req, res) => {
  try {
    const budget = req.body;
    if (!budget.id) {
      return res.status(400).json({ error: 'ID em falta' });
    }
    fs.writeFileSync(path.join(DATA_DIR, `${budget.id}.json`), JSON.stringify(budget, null, 2), 'utf8');
    res.status(201).json({ success: true, id: budget.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao guardar orçamento' });
  }
});

// Update an existing budget
app.put('/api/budgets/:id', (req, res) => {
  try {
    const file = path.join(DATA_DIR, `${req.params.id}.json`);
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar orçamento' });
  }
});

// Delete a budget
app.delete('/api/budgets/:id', (req, res) => {
  try {
    const file = path.join(DATA_DIR, `${req.params.id}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao eliminar orçamento' });
  }
});

app.listen(PORT, () => {
  console.log(`API a correr em http://localhost:${PORT}`);
  console.log(`Orçamentos guardados em: ${DATA_DIR}`);
});
