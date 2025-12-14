import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const month = req.query.month as string;

  const result = await prisma.report.aggregate({
    where: { month },
    _count: { ngoId: true },
    _sum: {
      peopleHelped: true,
      eventsConducted: true,
      fundsUtilized: true
    }
  });

  res.json({
    totalNGOs: result._count.ngoId,
    totalPeopleHelped: result._sum.peopleHelped || 0,
    totalEvents: result._sum.eventsConducted || 0,
    totalFunds: result._sum.fundsUtilized || 0
  });
});

export default router;
