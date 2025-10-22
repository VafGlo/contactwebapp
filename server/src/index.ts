import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";

const app = express();
const PORT = 4000;

// Habilita CORS solo para el Front
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("API Node.js funcionando correctamente");
});

// Rutas de usuarios
app.use("/api/users", usersRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(` Servidor API corriendo en http://localhost:${PORT}`);
});
