import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import twilio from 'twilio';



const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN);


// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Función flecha que hace la llamada
const createCall = async () => {
  try {
    const call = await client.calls.create({
      from: '+17127170508', // Número Twilio (verificado)
      to: '+50235818488',   // Tu número destino (verificado)
      url: 'http://demo.twilio.com/docs/voice.xml',
    });
    console.log('Llamada iniciada, SID:', call.sid);
  } catch (error) {
    console.error('Error al realizar la llamada:', error.message);
  }
};

// Variables globales
let temperaturaActual = null;
let comandoActual = 'parar';
let llamadaRealizada = false; // ← NUEVA VARIABLE

// 1. Arduino envía temperatura
app.post('/temperatura', async (req, res) => {
  const { valor } = req.body;

  if (typeof valor === 'number') {
    temperaturaActual = valor;
    console.log(`Temperatura recibida: ${valor}°C`);

    // Verifica si supera los 33°C
    if (valor > 30 && !llamadaRealizada) {
      console.log('Temperatura crítica detectada. Iniciando llamada...');
      await createCall();
      llamadaRealizada = true; // ← MARCAR COMO LLAMADA HECHA
    }

    // Si baja la temperatura, se permite una futura llamada
    if (valor <= 30) {
      llamadaRealizada = false;
    }

    res.send('Temperatura guardada');
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
