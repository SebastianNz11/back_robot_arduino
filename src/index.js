import express from "express";
import cors from "cors";

const app = express();

// Configurar CORS para permitir solo la URL específica
const corsOptions = {
  origin: "https://front-robot-arduino.onrender.com",
};

app.use(cors(corsOptions));
app.use(express.json());

let ultimoComando = "parar";
let ultimaTemperatura = null;

// Recibir temperatura desde Arduino
app.post("/temperatura", (req, res) => {
  try {
    const { valor } = req.body;
    ultimaTemperatura = valor;
    console.log("Temperatura recibida:", valor);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al recibir la temperatura:", error);
  }
});

// Recibir comando desde la web
app.post("/comando", (req, res) => {
  try {
    const { accion } = req.body;
    console.log("Comando recibido:", accion);
    ultimoComando = accion;
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al recibir el comando:", error);
  }
});

// Arduino consulta el comando
app.get("/leer_comando", (req, res) => {
  try {
    res.send(ultimoComando);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error al leer el comando");
  }
});

app.get("/temperatura", (req, res) => {
  try {
    res.json({ valor: ultimaTemperatura });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error al leer la temperatura");
  }
});

app.listen(4000, () => {
  console.log("Servidor escuchando en puerto 4000");
});
