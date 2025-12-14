import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized } = req.body;

    await prisma.report.upsert({
      where: {
        ngoId_month: { ngoId, month }
      },
      update: {
        peopleHelped,
        eventsConducted,
        fundsUtilized
      },
      create: {
        ngoId,
        month,
        peopleHelped,
        eventsConducted,
        fundsUtilized
      }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid input" });
  }
});

export default router;
