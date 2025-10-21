import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("✅ API Node.js funcionando correctamente");
});

// Rutas de usuarios (imitando reqres)
app.use("/api/users", usersRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});
