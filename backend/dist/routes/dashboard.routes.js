"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", async (req, res) => {
    const month = req.query.month;
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
exports.default = router;
