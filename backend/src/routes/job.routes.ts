import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/:id", async (req, res) => {
  const job = await prisma.job.findUnique({
    where: { id: req.params.id }
  });
  res.json(job);
});

export default router;
