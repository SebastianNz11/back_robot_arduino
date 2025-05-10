import express from 'express'
const app = express();
const port = 3000;

// Middleware para manejar los datos JSON
app.use(express.json());

// Recibir temperatura desde Arduino y reenviarla al servidor de Render
app.post('/temperatura', async (req, res) => {
  try {
    const response = await fetch('https://back-robot-arduino.onrender.com/temperatura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    res.status(response.status).send(response.statusText);
  } catch (err) {
    console.error("Error al reenviar la temperatura:", err);
    res.status(500).send("Error al reenviar la temperatura");
  }
});

// Recibir comando desde Arduino y reenviarlo al servidor de Render
app.get('/leer_comando', async (req, res) => {
  try {
    const response = await fetch('https://back-robot-arduino.onrender.com/leer_comando');
    const comando = await response.text();
    res.send(comando);
  } catch (err) {
    console.error("Error al leer el comando:", err);
    res.status(500).send("Error al leer el comando");
  }
});

// Iniciar el servidor en el puerto local 3000
app.listen(port, () => {
  console.log(`Servidor proxy escuchando en http://localhost:${port}`);
});
