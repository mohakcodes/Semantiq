import express from "express";
import { analyzeText } from "../controllers/analyze.controller.js";

const router = express.Router();
router.post("/", analyzeText);

export { router as analyzeRouter };
