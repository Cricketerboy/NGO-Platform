"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
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
    }
    catch (err) {
        res.status(400).json({ error: "Invalid input" });
    }
});
exports.default = router;
