// backend/index.js
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let temperaturaActual = null;  // Última temperatura recibida del Arduino
let comandoActual = 'parar';   // Último comando enviado desde el frontend

// 1. Arduino envía temperatura
app.post('/temperatura', (req, res) => {
  const { valor } = req.body;
  if (typeof valor === 'number') {
    temperaturaActual = valor;
  } else {
    res.status(400).send('Formato incorrecto');
  }
});

// 2. Frontend consulta temperatura
app.get('/temperatura', (req, res) => {
  if (temperaturaActual !== null) {
    res.json({ valor: temperaturaActual });
  } else {
    res.status(404).json({ error: 'Temperatura no disponible' });
  }
});

// 3. Frontend envía comando
app.post('/comando', (req, res) => {
  const { accion } = req.body;
  if (typeof accion === 'string') {
    comandoActual = accion;
    console.log(`Nuevo comando recibido del frontend: ${accion}`);
    res.send('Comando actualizado');
  } else {
    res.status(400).send('Formato de comando inválido');
  }
});

// 4. Arduino lee el comando
app.get('/leer_comando', (req, res) => {
  console.log(`Comando enviado al Arduino: ${comandoActual}`);
  res.send(comandoActual);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
