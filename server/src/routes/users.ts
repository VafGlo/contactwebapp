import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const page = req.query.page || 1;

  try {
    const response = await fetch(`https://reqres.in/api/users?page=${page}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

export default router;
