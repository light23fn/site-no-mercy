const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const FILE = 'mensagens.json';

// Endpoint para receber mensagens
app.post('/suporte', (req, res) => {
  const novaMsg = req.body;
  let mensagens = [];

  if (fs.existsSync(FILE)) {
    mensagens = JSON.parse(fs.readFileSync(FILE));
  }

  novaMsg.id = Date.now();
  novaMsg.resposta = null;
  mensagens.push(novaMsg);

  fs.writeFileSync(FILE, JSON.stringify(mensagens, null, 2));
  res.status(200).json({ sucesso: true, mensagem: 'Mensagem recebida!' });
});

// Endpoint para ver todas
app.get('/mensagens', (req, res) => {
  if (!fs.existsSync(FILE)) return res.json([]);
  const mensagens = JSON.parse(fs.readFileSync(FILE));
  res.json(mensagens);
});

// Endpoint para responder
app.post('/responder/:id', (req, res) => {
  if (!fs.existsSync(FILE)) return res.status(404).json({ erro: 'Sem mensagens' });

  const mensagens = JSON.parse(fs.readFileSync(FILE));
  const msg = mensagens.find(m => m.id == req.params.id);

  if (!msg) return res.status(404).json({ erro: 'Mensagem não encontrada' });

  msg.resposta = req.body.resposta;
  fs.writeFileSync(FILE, JSON.stringify(mensagens, null, 2));

  res.json({ sucesso: true, mensagem: 'Resposta enviada' });
});

app.listen(3000, () => console.log('Servidor no ar em http://localhost:3000'));
