import { Router } from "express";

const router = Router();

// Ruta que imita la API de reqres.in
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await fetch(`https://reqres.in/api/users?page=${page}`);
    const data = await response.json();

    res.json(data);
  } catch (err: any) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

export default router;
