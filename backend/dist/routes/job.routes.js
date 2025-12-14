"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/:id", async (req, res) => {
    const job = await prisma.job.findUnique({
        where: { id: req.params.id }
    });
    res.json(job);
});
exports.default = router;
